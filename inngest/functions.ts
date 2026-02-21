import { inngest } from './client';
import { generateText, Output } from 'ai';
import { z } from 'zod';
import { TransactionSchema } from '@/lib/utils';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
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
		},
		required: ['date', 'description', 'amount', 'type', 'category'],
	},
} as const;

export const processStatement = inngest.createFunction(
	{ id: 'process-bank-statement', retries: 2 },
	{ event: 'statement/uploaded' },
	async ({ event, step }) => {
		const { fileUrl } = event.data;

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
						source_url: fileUrl,
						tier: 'cost_effective',
						version: 'latest',
					}),
				},
			);
			const data = await response.json();
			return data.id;
		});

		// 2. POLLING LOOP (Wait for Completion)
		let status = 'PENDING';
		let markdownOutput = '';

		while (status !== 'COMPLETED' && status !== 'FAILED') {
			await step.sleep('polling-delay', '10s'); // Wait 3 seconds between checks

			const result = await step.run('check-parse-status', async () => {
				const response = await fetch(
					`https://api.cloud.llamaindex.ai/api/v2/parse/${jobId}?expand=markdown`,
					{
						headers: {
							'Authorization': `Bearer ${process.env.LLAMA_CLOUD_API_KEY}`,
						},
					},
				);
				return await response.json();
			});

			status = result.job.status;
			if (status === 'COMPLETED') {
				markdownOutput = result.markdown.pages
					.map((p: any) => p.markdown)
					.join('\n\n');
			}
		}

		if (status === 'FAILED') {
			throw new Error('LlamaParse failed to process the document.');
		}
		const model = genAI.getGenerativeModel({
			model: 'gemini-2.5-flash',
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema: schema,
			},
		});

		// 3. Handing off to the Cleaning Agent
		const cleaningAgent = async (markdown: string) => {
			const prompt = `
   				 You are an expert Nigerian financial analyst. 
    				Convert the following bank statement markdown into a clean JSON array of transactions.
    
   					 Processing Rules:
    				1. Standardize descriptions: e.g., 'FIP:MB:ECO/ADEKUNLE' becomes 'Adekunle'.
    			2. Identify Categories: 'BAP:CD' is usually Utilities/Airtime; 'VAT' or 'Charges' are Fees.
    			3. Ignore balance rows (Opening/Closing balance).
    
    			Data:
			    ${markdownOutput}
  				`;

			const result = await model.generateContent(prompt);
			return JSON.parse(result.response.text());
		};

		const cleanTransactions = await step.run(
			'clean-and-categorize',
			async () => {
				return await cleaningAgent(markdownOutput);
			},
		);

		return { status: 'SUCCESS', dataLength: markdownOutput.length };
	},
);
