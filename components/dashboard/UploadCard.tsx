import { useState } from 'react';
import { toast } from 'sonner'; // Assuming you use sonner based on your toast calls
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { uploadStatementAction, useDemoData } from '@/actions/server';

export default function UploadCard({
	sessionId,
	isError,
}: {
	sessionId: string;
	isError: boolean;
}) {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// 1. Change the parameter to accept the Form Event
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault(); // 2. Stop the browser from refreshing the page

		// 3. Extract the formData manually from the form
		const formData = new FormData(e.currentTarget);
		const file = formData.get('statement') as File;

		if (!file || file.type !== 'application/pdf') {
			setError('Only PDF files are allowed');
			return;
		}

		setError(null);
		setLoading(true); // This will now instantly trigger a re-render!

		try {
			// 4. Await your server action directly
			const response = await uploadStatementAction(formData, sessionId);

			if (response.success) {
				toast.success(
					'Analysis started! You can track progress in your dashboard.',
				);
			} else {
				setError(`${response.error}`);
				toast.error('Processing failed, try again!');
			}
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Card className='max-w-sm shadow-lg mx-auto justify-self-auto'>
			<CardHeader>
				<CardTitle>Upload your bank statement</CardTitle>
				<CardDescription>
					Our system will process your statement asynchronously using AI agents.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-5'>
				{/* 5. Change 'action' to 'onSubmit' */}
				<form onSubmit={handleSubmit} className='space-y-4'>
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
					<Button type='submit' className='w-full' disabled={loading}>
						{loading ? 'Processing...' : 'Submit Statement'}
					</Button>
				</form>

				<Button
					className='w-full'
					variant='ghost'
					onClick={async () => {
						// You might want to add loading state for this demo button too!
						await useDemoData(sessionId);
					}}
					disabled={loading}
				>
					Use Demo Data
				</Button>

				{error && <p className='text-red-500 text-sm text-center'>{error}</p>}

				{isError && (
					<div className='text-red-600 font-medium text-center mt-4 space-y-1'>
						<p>We couldn't process your document.</p>
						<p className='text-sm'>
							If the problem continues, upload a different file.
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
