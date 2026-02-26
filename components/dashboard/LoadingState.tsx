import React from 'react';
import Lottie from 'lottie-react';
import loading_animation from '../../public/loading_animation.json';

export default function LoadingState({ status }: { status: string }) {
	return (
		<div className='flex flex-col items-center justify-center text-xl font-semibold text-muted-foreground'>
			<div className='size-80'>
				<Lottie animationData={loading_animation} />
			</div>
			{status == 'Submitted' && (
				<p className='animate-pulse'>Crunching the numbers...</p>
			)}
			{status == 'Parsing' && <p className='animate-pulse'></p>}
			{status == 'Parsed' && (
				<p className='animate-pulse'>Organizing your financial data...</p>
			)}
			{/* <p>Making sense of your expenses...</p> */}
			{status == 'Cleaning' && (
				<p className='animate-pulse'>Tidying up your transactions...</p>
			)}
		</div>
	);
}
