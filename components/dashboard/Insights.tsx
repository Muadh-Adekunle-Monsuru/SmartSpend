import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Sparkles, Info } from 'lucide-react';

interface InsightsProps {
	insights?: { description: string; title: string }[];
}

export default function Insights({ insights }: InsightsProps) {
	return (
		<Card className='w-full max-w-2xl bg-gradient-to-br from-slate-50 to-white shadow-sm border-slate-200'>
			<CardHeader className='pb-4'>
				<div className='flex items-center gap-2'>
					{/* A subtle icon to indicate AI/Smart features */}
					<Sparkles className='w-5 h-5 text-indigo-600' />
					<CardTitle className='text-xl text-slate-900'>
						Smart Insights
					</CardTitle>
				</div>
				<CardDescription className='text-slate-500'>
					Personalized analysis based on your recent transaction data.
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-6'>
				{/* Handle the loading/empty state gracefully */}
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
						<div key={index} className='flex gap-4 items-start'>
							{/* Number indicator */}
							<div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs'>
								{index + 1}
							</div>

							{/* Text content */}
							<div className='space-y-1 mt-0.5'>
								<h4 className='text-sm font-semibold leading-none text-slate-900'>
									{insight.title}
								</h4>
								<p className='text-sm text-slate-600 leading-snug'>
									{insight.description}
								</p>
							</div>
						</div>
					))
				)}
			</CardContent>

			<CardFooter className='bg-slate-50/80 px-6 py-4 border-t border-slate-100 mt-2'>
				<div className='flex items-start gap-2 text-xs text-slate-500'>
					<Info className='w-4 h-4 shrink-0 mt-0.5 text-slate-400' />
					<p>
						Kindly note that these are AI-generated insights to help you track
						your spending, and should not be taken as professional financial
						advice.
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}
