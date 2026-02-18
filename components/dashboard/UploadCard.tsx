'use client';
import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { uploadStatementAction } from '@/actions/server';
import { toast } from 'sonner';

export default function UploadCard() {
	const [error, setError] = useState<String | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(formData: FormData) {
		const file = formData.get('statement') as File;

		if (!file || file.type !== 'application/pdf') {
			setError('Only PDF files are allowed');
			return;
		}
		setError(null);
		setLoading(true);
		try {
			await uploadStatementAction(formData).then(() => {
				toast.success(
					'Analysis started! You can track progress in your dashboard.',
				);
			});
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}
	return (
		<Card className='max-w-sm shadow-md '>
			<CardHeader>
				<CardTitle>Upload your bank-statement</CardTitle>
				<CardDescription>
					Our system will process your statement asynchronously using AI agents.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={handleSubmit} className='space-y-4'>
					<Label className='mb-1' htmlFor='statement'>
						Statement (PDF)
					</Label>
					<Input
						id='statement'
						name='statement'
						accept='application/pdf'
						type='file'
						required
					/>
					<Label htmlFor='password'>Statement Password (If any)</Label>
					<Input
						id='password'
						name='password'
						type='password'
						placeholder='Enter the PDF Password'
					/>
					{error && <p className='text-red-500 text-sm'>{error}</p>}
					<Button type='submit' className='w-full' disabled={loading}>
						{loading ? 'Processing...' : 'Submit Statement'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
