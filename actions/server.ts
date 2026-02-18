'use server';
import { inngest } from '@/inngest/client';
import cloudinary from '@/lib/cloudinary';
import { PDFDocument } from 'pdf-lib';
import { decrypt } from 'node-qpdf2';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

export async function uploadStatementAction(formData: FormData) {
	const file = formData.get('statement') as File;
	const password = formData.get('password') as string;

	const tempInputPath = path.join(os.tmpdir(), `input-${Date.now()}.pdf`);
	const tempOutputPath = path.join(os.tmpdir(), `output-${Date.now()}.pdf`);

	try {
		const arrayBuffer = await file.arrayBuffer();
		await fs.writeFile(tempInputPath, Buffer.from(arrayBuffer));

		if (password) {
			console.log('Using QPDF to decrypt statement...');
			// QPDF is significantly more powerful than pdf-lib for bank encryptions
			await decrypt({ input: tempInputPath, password, output: tempOutputPath });
		} else {
			// If no password, just use the original file
			await fs.copyFile(tempInputPath, tempOutputPath);
		}

		const decryptedBuffer = await fs.readFile(tempOutputPath);

		// Proceed to Cloudinary with the decryptedBuffer
		const uploadResult = (await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{ resource_type: 'raw', folder: 'bank_statements' },
					(error, result) => (error ? reject(error) : resolve(result)),
				)
				.end(decryptedBuffer);
		})) as any;

		// Clean up temp files
		await Promise.all([fs.unlink(tempInputPath), fs.unlink(tempOutputPath)]);

		// Trigger Inngest
		await inngest.send({
			name: 'statement/uploaded',
			data: { fileUrl: uploadResult.secure_url, userId: 'user_123' },
		});

		return { success: true };
	} catch (err: any) {
		console.error('Final Decryption Failure:', err);
		return {
			success: false,
			error: 'Unable to unlock PDF. Please verify the password.',
		};
	}
}
