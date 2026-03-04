import { useMemo } from 'react';

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
			<div className='border-4 border-black p-6 bg-white'>
				<h3 className='text-xs font-black tracking-widest uppercase mb-6 border-b-4 border-black pb-4 text-black'>
					Busiest Day
				</h3>
				<p className='text-xs text-gray-700 uppercase tracking-wider mb-4'>
					The day with the highest volume of transaction activity
				</p>
				<p className='text-sm text-slate-500 text-center py-4'>
					No transaction data available yet.
				</p>
			</div>
		);
	}

	const formattedDate = new Date(maxDate).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	return (
		<div className='border-4 border-black p-6 bg-white'>
			<h3 className='text-xs font-black tracking-widest uppercase mb-6 border-b-4 border-black pb-4 text-black'>
				Busiest Day
			</h3>
			<p className='text-xs text-gray-700 uppercase tracking-wider mb-4'>
				The day with the highest volume of transaction activity
			</p>

			<div className='space-y-6'>
				<div className='grid grid-cols-2 gap-4 border-b-4 border-black pb-6'>
					<div>
						<p className='text-xs text-gray-700 uppercase tracking-wider mb-2'>
							Date
						</p>
						<p className='text-2xl font-black text-black'>{formattedDate}</p>
					</div>
					<div>
						<p className='text-xs text-gray-700 uppercase tracking-wider mb-2'>
							Transactions
						</p>
						<p className='text-2xl font-black text-black'>{maxCount}</p>
					</div>
				</div>

				<div>
					<h4 className='text-xs font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-3 text-black'>
						Activity on this day
					</h4>

					<div className='space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar'>
						{topDayTransactions.map((trans, index) => (
							<div
								key={`${trans.description}-${index}`}
								className='border-l-4 border-neutral-600 pl-3'
							>
								<span className='text-sm font-black mb-1 text-black line-clamp-1'>
									{trans.description}
								</span>
								<span className='text-sm text-slate-600 font-black'>
									{trans.category}
								</span>
								<div
									className={`text-xs text-gray-700 uppercase mt-1 whitespace-nowrap ${
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
			</div>
		</div>
	);
}
