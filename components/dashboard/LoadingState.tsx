import React from 'react';
import Lottie from 'lottie-react';
import loading_animation from '../../public/loading_animation.json';

// 1. Map your statuses to text and progress percentages
// This makes it incredibly easy to add new steps later without cluttering the JSX
const loadingStages: Record<string, { text: string; progress: number }> = {
	Pending: { text: 'Preparing your file...', progress: 10 },
	Submitted: { text: 'Crunching the numbers...', progress: 35 },
	Parsing: { text: 'Organizing your financial data...', progress: 65 },
	Cleaning: { text: 'Tidying up your transactions...', progress: 90 },
	Completed: { text: 'Done! Loading dashboard...', progress: 100 },
};

export default function LoadingState({ status }: { status: string }) {
	// 2. Safely grab the current stage, fallback to 'Pending' if the status is unknown
	const currentStage = loadingStages[status] || loadingStages['Pending'];

	return (
		<div className='flex flex-col items-center justify-center w-full max-w-sm mx-auto p-6 space-y-8'>
			{/* Lottie Animation (Slightly scaled down and given a subtle drop shadow) */}
			<div className='w-56 h-56 drop-shadow-lg'>
				<Lottie animationData={loading_animation} loop={true} />
			</div>

			<div className='w-full space-y-4 text-center'>
				{/* The active message */}
				<p className='text-lg font-medium text-slate-800 animate-pulse'>
					{currentStage.text}
				</p>

				{/* The Progress Bar Track */}
				<div className='w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner'>
					{/* The Animated Progress Fill */}
					<div
						className='h-full bg-indigo-600 rounded-full transition-all duration-700 ease-in-out'
						style={{ width: `${currentStage.progress}%` }}
					/>
				</div>

				{/* Optional: The hard number so users know it isn't stuck */}
				<p className='text-sm font-semibold text-slate-400'>
					{currentStage.progress}%
				</p>
			</div>
		</div>
	);
}
