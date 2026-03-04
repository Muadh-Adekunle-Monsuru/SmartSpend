import { Sparkles } from 'lucide-react';

interface InsightsProps {
	insights?: { description: string; title: string }[];
}

export default function Insights({ insights }: InsightsProps) {
	return (
		<div className='border-4 border-black p-6 bg-white'>
			<div className='flex items-center gap-2 w-full border-b-4 border-black pb-4 mb-6'>
				<Sparkles className='w-5 h-5 text-indigo-600' />
				<h2 className='text-xs font-black tracking-widest uppercase  text-black '>
					Smart Insights
				</h2>
			</div>

			<p className='text-xs text-gray-700 uppercase tracking-wider mb-6'>
				Personalized analysis based on your recent transaction data.
			</p>

			<div className='space-y-6'>
				{!insights || insights.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-8 text-slate-400 space-y-3'>
						<Sparkles className='w-6 h-6 animate-pulse text-indigo-300' />
						<p className='text-sm font-medium animate-pulse'>
							Analyzing your transactions...
						</p>
					</div>
				) : (
					/* Map through the insights with a clean numbered layout */
					insights.map((insight, index) => (
						<div key={index} className=' pl-4 pb-4 last:pb-0'>
							<div className='flex items-center gap-3 mb-2'>
								<div className='w-6 h-6 border-2 border-orange-600 flex items-center justify-center flex-shrink-0 bg-orange-100'>
									<span className='text-xs font-black text-orange-700'>
										{index + 1}
									</span>
								</div>
								<h4 className='text-sm font-black uppercase text-black'>
									{insight.title}
								</h4>
							</div>
							<p className='text-xs text-gray-700 leading-relaxed'>
								{insight.description}
							</p>
						</div>
					))
				)}
			</div>

			<div className='mt-6 pt-6 border-t-2 border-gray-300'>
				<p className='text-xs text-gray-600 flex items-start gap-2'>
					<span className='text-lg leading-none mt-0.5'>ℹ</span>
					<span>
						Kindly note that these are AI-generated insights to help you track
						your spending and should not be taken as professional financial
						advice
					</span>
				</p>
			</div>
		</div>
	);
}
