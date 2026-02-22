'use server';
import { inngest } from '@/inngest/client';
import cloudinary from '@/lib/cloudinary';
import { PDFDocument } from 'pdf-lib';
import { decrypt } from 'node-qpdf2';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { nanoid } from 'nanoid';

export async function uploadStatementAction(
	formData: FormData,
	sessionId: string,
) {
	const file = formData.get('statement') as File;
	const password = formData.get('password') as string;

	const tempInputPath = path.join(os.tmpdir(), `input-${Date.now()}.pdf`);
	const tempOutputPath = path.join(os.tmpdir(), `output-${Date.now()}.pdf`);

	try {
		const arrayBuffer = await file.arrayBuffer();
		await fs.writeFile(tempInputPath, Buffer.from(arrayBuffer));

		if (password) {
			try {
				await decrypt({
					input: tempInputPath,
					password,
					output: tempOutputPath,
				});
			} catch (err: any) {
				// Check if it's just a warning about a "damaged" file
				if (err?.includes('operation succeeded with warnings')) {
					console.warn('QPDF warning:', err);
				} else {
					// If it's a real failure (wrong password), throw it
					throw err;
				}
			}
		} else {
			// If no password, just use the original file
			await fs.copyFile(tempInputPath, tempOutputPath);
		}

		const decryptedBuffer = await fs.readFile(tempOutputPath);

		// Proceed to Cloudinary with the decryptedBuffer
		console.log('Starting Cloudinary upload...');
		const uploadResult = (await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: 'raw',
						folder: 'bank_statements',
						public_id: `${Date.now()}-statement.pdf`,
					},
					(error, result) => (error ? reject(error) : resolve(result)),
				)
				.end(decryptedBuffer);
		})) as any;

		// Clean up temp files
		await Promise.all([fs.unlink(tempInputPath), fs.unlink(tempOutputPath)]);

		// Trigger Inngest
		await inngest.send({
			name: 'statement/uploaded',
			data: { fileUrl: uploadResult.secure_url, sessionId },
		});

		return { success: true };
	} catch (err: any) {
		console.error('Final Decryption Failure:', err);
		return {
			success: false,
			error: 'Unable to unlock PDF. Please try again.',
		};
	}
}
