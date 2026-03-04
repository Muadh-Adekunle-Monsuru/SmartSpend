'use server';
import { api } from '@/convex/_generated/api';
import { inngest } from '@/inngest/client';
import cloudinary from '@/lib/cloudinary';
import { fetchMutation } from 'convex/nextjs';
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
			data: {
				fileUrl: uploadResult.secure_url,
				sessionId,
				password,
				publicId: uploadResult.public_id,
				isDemo: false,
			},
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

export const deleteOnCloudinary = async (publicId: string) => {
	try {
		const deleteResult = await cloudinary.uploader.destroy(publicId, {
			resource_type: 'raw', // This is required since it's a PDF/raw file
		});

		if (deleteResult.result === 'ok') {
			console.log('File successfully deleted from Cloudinary');
		} else {
			console.warn('File deletion reported an issue:', deleteResult);
		}
	} catch (error) {
		console.error('Failed to delete file from Cloudinary:', error);
	}
};

export const useDemoData = async (sessionId: string) => {
	await inngest.send({
		name: 'statement/uploaded',
		data: {
			fileUrl:
				'https://res.cloudinary.com/dzrkcnt5h/image/upload/v1772541563/Opay_kojjdf.pdf',
			sessionId,
			publicId: 'Opay_kojjdf',
			isDemo: true,
		},
	});
};
