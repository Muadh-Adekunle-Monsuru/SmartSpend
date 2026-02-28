import { inngest } from './client';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { TransactionSchema } from '@/lib/utils';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { decrypt } from 'node-qpdf2';
import cloudinary from '@/lib/cloudinary';
import { updateStatus } from '@/actions/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const schema: Schema = {
	type: SchemaType.ARRAY,
	description: 'List of extracted bank transactions',
	items: {
		type: SchemaType.OBJECT,
		properties: {
			date: { type: SchemaType.STRING },
			description: { type: SchemaType.STRING },
			amount: { type: SchemaType.NUMBER },
			type: { type: SchemaType.STRING },
			category: { type: SchemaType.STRING },
			balance: { type: SchemaType.NUMBER },
		},
		required: ['date', 'description', 'amount', 'type', 'category', 'balance'],
	},
} as const;

const agent_prompt = `
You are an expert Nigerian financial data analyst and transaction parser.

Your task is to convert the provided Nigerian bank statement (in markdown format) into a clean, structured JSON array of transactions.

Output Requirements:

Return ONLY valid JSON.

The output must be an array of objects.

Each transaction object must contain:

date (ISO format: YYYY-MM-DD)

description (cleaned and standardized)

amount (number; negative for debits, positive for credits)

type ("debit" or "credit")

category (standardized spending category)

balance (number; running/current balance after the transaction): !!!important

Processing Rules:

Description Cleaning & Standardization

Remove bank-specific prefixes and codes.

Extract meaningful merchant or recipient names.

Example transformations:

"FIP:MB:ECO/ADEKUNLE" → "Adekunle"

"POS 12345 SHOPRITE IKEJA" → "Shoprite Ikeja"

Remove transaction IDs, reference codes, and redundant metadata.

Category Identification (Nigeria-Specific Context)

"BAP:CD" → Utilities / Airtime

"VAT" or "Charges" → Bank Fees

"POS" → Shopping / Retail

"ATM" → Cash Withdrawal

"TRF" or "TRANSFER" → Transfer

Telecom providers (MTN, Airtel, Glo, 9mobile) → Airtime/Data

If unclear, infer the most reasonable category based on description context.

Amounts & Balance

Ensure debits are negative values.

Ensure credits are positive values.

Always return the correct running balance for each transaction.

Data Integrity

Do not hallucinate missing transactions.

Do not omit any valid transaction.
If a balance column exists in the data, extract it exactly.
If balance cannot be determined, return 0 instead of omitting the field.

If a field is missing in the input, infer only when logically certain.
`;
export const processStatement = inngest.createFunction(
	{ id: 'process-bank-statement', retries: 2 },
	{ event: 'statement/uploaded' },
	async ({ event, step }) => {
		const { fileUrl, sessionId, password } = event.data;

		await updateStatus('Submitted', sessionId);
		try {
			const processedFileUrl = await step.run(
				'download-and-decrypt',
				async () => {
					const tempInputPath = path.join(
						os.tmpdir(),
						`input-${Date.now()}.pdf`,
					);
					const tempOutputPath = path.join(
						os.tmpdir(),
						`output-${Date.now()}.pdf`,
					);

					try {
						const response = await fetch(fileUrl);
						const buffer = Buffer.from(await response.arrayBuffer());
						await fs.writeFile(tempInputPath, buffer);

						if (password) {
							try {
								await decrypt({
									input: tempInputPath,
									password,
									output: tempOutputPath,
								});
							} catch (err) {
								const message = String(err);

								// Only ignore if output file actually exists
								const outputExists = await fs
									.stat(tempOutputPath)
									.then(() => true)
									.catch(() => false);

								if (
									message.includes('operation succeeded with warnings') &&
									outputExists
								) {
									console.warn('PDF repaired successfully. Continuing.');
								} else {
									throw new Error(
										'Decryption failed: invalid password or corrupted file.',
									);
								}
							}
						} else {
							await fs.copyFile(tempInputPath, tempOutputPath);
						}

						const uploadResult = await cloudinary.uploader.upload(
							tempOutputPath,
							{
								resource_type: 'raw',
								folder: 'bank_statements/decrypted',
							},
						);

						return uploadResult.secure_url;
					} finally {
						await Promise.allSettled([
							fs.unlink(tempInputPath),
							fs.unlink(tempOutputPath),
						]);
					}
				},
			);
			// 1. INITIATE PARSE JOB
			const jobId = await step.run('initiate-llamaparse', async () => {
				const response = await fetch(
					'https://api.cloud.llamaindex.ai/api/v2/parse',
					{
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${process.env.LLAMA_CLOUD_API_KEY}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							source_url: processedFileUrl,
							tier: 'cost_effective',
							version: 'latest',
						}),
					},
				);
				const data = await response.json();
				return data.id;
			});

			await updateStatus('Parsing', sessionId);

			// 2. POLLING LOOP (Wait for Completion)
			let status = 'PENDING';

			let parseResult: any;

			while (true) {
				const result = await step.run('check-parse-status', async () => {
					const response = await fetch(
						`https://api.cloud.llamaindex.ai/api/v2/parse/${jobId}?expand=markdown`,
						{
							headers: {
								Authorization: `Bearer ${process.env.LLAMA_CLOUD_API_KEY}`,
							},
						},
					);

					return response.json();
				});

				const status = result.job.status;

				console.log('LlamaParse status:', status);

				if (status === 'COMPLETED') {
					parseResult = result;
					break;
				}

				if (status === 'FAILED') {
					throw new Error('Parse failed');
				}

				await step.sleep('wait-before-retry', '15s');
			}

			const markdownOutput = parseResult.markdown.pages
				.map((p: any) => p.markdown)
				.join('\n\n');

			const model = genAI.getGenerativeModel({
				model: 'gemini-2.5-flash',
				generationConfig: {
					responseMimeType: 'application/json',
					responseSchema: schema,
				},
			});

			// // 3. Handing off to the Cleaning Agent
			const cleaningAgent = async (markdown: string) => {
				const prompt = `
				${agent_prompt} 
				Data:
			    ${markdown}
				`;

				const result = await model.generateContent(prompt);
				try {
					const parsed = JSON.parse(result.response.text());
					return z.array(TransactionSchema).parse(parsed);
				} catch (err) {
					throw new Error('Gemini returned invalid JSON');
				}
			};

			await updateStatus('Cleaning', sessionId);

			const cleanTransactions = await step.run(
				'clean-and-categorize',
				async () => {
					return await cleaningAgent(markdownOutput);
				},
			);

			const uploadToData = await step.run('upload-to-database', async () => {
				return await fetchMutation(api.convexFunctions.saveCategorized, {
					sessionId,
					transactions: cleanTransactions,
				});
			});

			await updateStatus('Complete', sessionId);
			return { status: 'SUCCESS' };
		} catch (err) {
			await updateStatus('Failed', sessionId);
			throw err;
		}
	},
);
