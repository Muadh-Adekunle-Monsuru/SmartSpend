'use server';
import { inngest } from '@/inngest/client';
import cloudinary from '@/lib/cloudinary';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
export async function uploadStatementAction(
	formData: FormData,
	sessionId: string,
) {
	const file = formData.get('statement') as File;
	const password = formData.get('password') as string;
	try {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const uploadResult = (await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					resource_type: 'raw',
					folder: 'bank_statements',
				},
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result);
					}
				},
			);

			uploadStream.end(buffer);
		})) as any;

		// Trigger Inngest

		await inngest.send({
			name: 'statement/uploaded',
			data: { fileUrl: uploadResult.secure_url, sessionId, password },
		});

		return { success: true };
	} catch (err: any) {
		console.error('Final Decryption Failure:', err);
		return {
			success: false,
			error:
				'Unable to upload PDF. Please try again with a smaller size document.',
		};
	}
}

export const updateStatus = async (status: string, sessionId: string) => {
	await fetchMutation(api.convexFunctions.updateRecordBySession, {
		newStatus: status,
		sessionId,
	});
};
