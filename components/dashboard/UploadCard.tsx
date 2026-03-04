import { uploadStatementAction, useDemoData } from '@/actions/server';
import { useState } from 'react';
import { toast } from 'sonner'; // Assuming you use sonner based on your toast calls

export default function UploadCard({
	sessionId,
	isError,
}: {
	sessionId: string;
	isError: boolean;
}) {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);

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
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setFile(e.target.files[0]);
		}
	};

	return (
		<div className=' max-w-xl border-4 border-black bg-white p-8'>
			<div className='mb-8'>
				<h2 className='text-3xl md:text-4xl font-black tracking-tight mb-3'>
					Upload your bank statement
				</h2>
				<p className='text-sm text-gray-700 leading-relaxed'>
					Our system will process your statement asynchronously using AI agents.
				</p>
			</div>

			<div className='space-y-5'>
				{/* 5. Change 'action' to 'onSubmit' */}
				<form onSubmit={handleSubmit}>
					<div className='mb-6 border-b-4 border-black pb-6'>
						<label className='text-xs font-black uppercase tracking-widest mb-3 block text-black'>
							Statement (PDF)
						</label>
						<input
							id='statement'
							name='statement'
							accept='application/pdf'
							type='file'
							required
							className=' w-full border-4 border-black p-4 cursor-pointer hover:bg-gray-50 transition-colors'
						/>
					</div>
					<div className='mb-8 border-b-4 border-black pb-6'>
						<label
							htmlFor='password'
							className='text-xs font-black uppercase tracking-widest mb-3 block text-black'
						>
							Statement Password (If any)
						</label>
						<input
							id='password'
							name='password'
							type='password'
							placeholder='Enter the PDF Password'
							className='w-full border-4 border-black bg-white px-4 py-3 text-sm font-black placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 focus:ring-offset-white'
						/>
					</div>
					<div className='space-y-4'>
						<button
							type='submit'
							className='w-full bg-red-600 border-4 border-black text-white font-black py-3 uppercase tracking-widest text-xs hover:bg-red-700 transition-all'
							disabled={loading}
						>
							{loading ? 'Processing...' : 'Submit Statement'}
						</button>
						<button
							className='w-full bg-white border-4 border-black text-black font-black py-3 uppercase tracking-widest text-xs hover:bg-gray-100 transition-all'
							onClick={async () => {
								setLoading(true);
								await useDemoData(sessionId);
							}}
							disabled={loading}
						>
							Use Demo Data
						</button>
					</div>
				</form>

				{error && <p className='text-red-500 text-sm text-center'>{error}</p>}

				{isError && (
					<div className='text-red-600 font-medium text-center mt-4 space-y-1'>
						<p>We couldn't process your document.</p>
						<p className='text-sm'>
							If the problem continues, upload a different file.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
