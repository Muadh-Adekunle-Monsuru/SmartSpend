'use client';

import Lottie from 'lottie-react';
import loading_animation from '../../public/loading_animation.json';

const loadingStages: Record<string, { text: string; progress: number }> = {
	Pending: { text: 'Preparing your file...', progress: 10 },
	Submitted: { text: 'Crunching the numbers...', progress: 35 },
	Parsing: { text: 'Organizing your financial data...', progress: 65 },
	Cleaning: { text: 'Tidying up your transactions...', progress: 90 },
	Completed: { text: 'Done! Loading dashboard...', progress: 100 },
};

export default function LoadingState({
	status = 'Pending',
}: {
	status?: string;
}) {
	const currentStage = loadingStages[status] || loadingStages['Pending'];

	return (
		<div className=' bg-amber-50 flex flex-col items-center justify-center p-6'>
			<div className='w-56 h-56 mx-auto drop-shadow-lg'>
				<Lottie animationData={loading_animation} loop={true} />
			</div>

			<div className='text-center mb-8'>
				<p className='text-lg md:text-xl font-black uppercase tracking-wide text-black mb-2'>
					{currentStage.text}
				</p>
			</div>

			<div className='mb-4 w-full'>
				<div className='w-full h-4 bg-white border-4 border-black overflow-hidden mb-4'>
					<div
						className='h-full bg-orange-600 transition-all duration-700 ease-in-out'
						style={{ width: `${currentStage.progress}%` }}
					/>
				</div>

				<div className='text-center'>
					<p className='text-2xl font-black text-black'>
						{currentStage.progress}%
					</p>
				</div>
			</div>

			{/* Divider */}
			<div className='my-8 border-t-2 border-black'></div>

			{/* Info Text */}
			<p className='text-xs font-black uppercase tracking-widest text-center text-gray-700'>
				Processing your bank statement with AI
			</p>
		</div>
	);
}
