import React from 'react';
import Lottie from 'lottie-react';
import loading_animation from '../../public/loading_animation.json';

export default function LoadingState({ status }: { status: string }) {
	return (
		<div>
			<div className='size-72'>
				<Lottie animationData={loading_animation} />
			</div>
			{status == 'Submitted' && <p>Reading your file...</p>}
			{status == 'Parsing' && <p>Crunching the numbers...</p>}
			{status == 'Parsed' && <p>Organizing your financial data...</p>}
			{/* <p>Making sense of your expenses...</p> */}
			{status == 'Cleaning' && <p>Tidying up your transactions...</p>}
		</div>
	);
}
