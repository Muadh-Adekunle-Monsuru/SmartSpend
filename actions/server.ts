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

	const tempInputPath = path.join(os.tmpdir(), `input-${Date.now()}.pdf`);
	try {
		const arrayBuffer = await file.arrayBuffer();
		await fs.writeFile(tempInputPath, Buffer.from(arrayBuffer));

		const uploadResult = await cloudinary.uploader.upload(tempInputPath, {
			resource_type: 'raw',
			folder: 'bank_statements',
		});

		await Promise.all([fs.unlink(tempInputPath)]);

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
			error: 'Unable to unlock PDF. Please try again.',
		};
	}
}

export const updateStatus = async (status: string, sessionId: string) => {
	await fetchMutation(api.convexFunctions.updateRecordBySession, {
		newStatus: status,
		sessionId,
	});
};
