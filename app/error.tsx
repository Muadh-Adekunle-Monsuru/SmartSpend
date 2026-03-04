'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void; // A function Next.js provides to try re-rendering the segment
}) {
	useEffect(() => {
		// This is where you would send the error to Sentry, LogRocket, etc.
		console.error('Client-side error caught:', error);
	}, [error]);

	return (
		<div className='flex h-[80vh] w-full items-center justify-center p-4'>
			<Card className='max-w-md w-full text-center shadow-lg border-red-100'>
				<CardHeader className='pb-4 flex flex-col items-center'>
					<div className='bg-red-50 p-3 rounded-full mb-2'>
						<AlertCircle className='w-8 h-8 text-red-500' />
					</div>
					<CardTitle className='text-xl'>Something went wrong</CardTitle>
					<CardDescription>
						We encountered an unexpected issue while processing your data.
					</CardDescription>
				</CardHeader>

				<CardContent className='space-y-4'>
					<p className='text-sm text-slate-500 bg-slate-50 p-3 rounded-md border border-slate-100'>
						{/* Show a friendly message, but hide the raw technical stack trace from users */}
						{error.message || 'An unknown error occurred in the application.'}
					</p>

					<div className='flex gap-3 justify-center pt-2'>
						<Button
							onClick={() => reset()}
							className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700'
						>
							<RefreshCcw className='w-4 h-4' />
							Try Again
						</Button>
						<Button
							variant='outline'
							onClick={() => (window.location.href = '/')}
						>
							Go to Homepage
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
