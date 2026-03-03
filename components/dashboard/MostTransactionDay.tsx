import { useMemo } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { CalendarDays, Activity } from 'lucide-react';

type Transaction = {
	amount: number;
	category: string;
	date: string;
	description: string;
	type: string;
};

interface MostTransactionDayProps {
	rawResult?: Transaction[];
}

export default function MostTransactionDay({
	rawResult,
}: MostTransactionDayProps) {
	const { maxDate, maxCount, topDayTransactions } = useMemo(() => {
		if (!rawResult || rawResult.length === 0) {
			return { maxDate: null, maxCount: 0, topDayTransactions: [] };
		}

		const counts = new Map<string, number>();
		let currentMaxDate = rawResult[0].date;
		let currentMaxCount = 0;

		// Single pass to count and find the max simultaneously
		rawResult.forEach((transaction) => {
			const newCount = (counts.get(transaction.date) || 0) + 1;
			counts.set(transaction.date, newCount);

			if (newCount > currentMaxCount) {
				currentMaxCount = newCount;
				currentMaxDate = transaction.date;
			}
		});

		const dayTransactions = rawResult.filter(
			(transaction) => transaction.date === currentMaxDate,
		);

		return {
			maxDate: currentMaxDate,
			maxCount: currentMaxCount,
			topDayTransactions: dayTransactions,
		};
	}, [rawResult]);

	if (!maxDate) {
		return (
			<Card className='w-full max-w-2xl'>
				<CardHeader>
					<CardTitle>Busiest Day</CardTitle>
					<CardDescription>
						Day with the highest volume of transactions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-slate-500 text-center py-4'>
						No transaction data available yet.
					</p>
				</CardContent>
			</Card>
		);
	}

	const formattedDate = new Date(maxDate).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	return (
		<Card className='w-full max-w-2xl'>
			<CardHeader className='pb-4'>
				<CardTitle className='flex items-center gap-2'>
					<CalendarDays className='w-5 h-5 text-indigo-600' />
					Busiest Day
				</CardTitle>
				<CardDescription>
					The day with the highest volume of transaction activity
				</CardDescription>
			</CardHeader>

			<CardContent className='space-y-6'>
				{/* Highlight Banner */}
				<div className='flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100'>
					<div>
						<p className='text-sm font-medium text-indigo-600 mb-1'>Date</p>
						<p className='text-2xl font-bold text-slate-900'>{formattedDate}</p>
					</div>
					<div className='text-right'>
						<p className='text-sm font-medium text-indigo-600 mb-1'>
							Transactions
						</p>
						<div className='flex items-center justify-end gap-1.5 text-2xl font-bold text-slate-900'>
							<Activity className='w-5 h-5 text-indigo-400' />
							{maxCount}
						</div>
					</div>
				</div>

				{/* Transaction List for that specific day */}
				<div className='space-y-3'>
					<h4 className='text-sm font-medium text-slate-700'>
						Activity on this day
					</h4>

					<div className='space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar'>
						{topDayTransactions.map((trans, index) => (
							<div
								key={`${trans.description}-${index}`}
								className='flex items-center justify-between p-3 text-sm bg-white border border-slate-100 rounded-lg shadow-sm'
							>
								<div className='flex flex-col'>
									<span className='font-medium text-slate-900 line-clamp-1'>
										{trans.description}
									</span>
									<span className='text-xs text-slate-500'>
										{trans.category}
									</span>
								</div>
								<div
									className={`font-semibold whitespace-nowrap ml-4 ${
										trans.type === 'credit'
											? 'text-green-600'
											: 'text-slate-900'
									}`}
								>
									{trans.type === 'credit' ? '+' : ''}₦
									{Math.abs(trans.amount).toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
