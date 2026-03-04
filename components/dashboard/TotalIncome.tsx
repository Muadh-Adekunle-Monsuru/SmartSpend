import { Transaction } from '@/lib/utils';

export default function TotalIncome({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const creditTransactions =
		rawResult
			?.filter((transaction) => transaction.type.toLowerCase() == 'credit')
			.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any)) ||
		[];

	const expenses = creditTransactions?.reduce(
		(sum, s) => (sum = sum + s.amount),
		0,
	);

	return (
		<div className='border-4 border-black p-6 bg-white'>
			<h3 className='text-xs font-black tracking-widest uppercase mb-6 border-b-4 border-black pb-4 text-black'>
				Total Income
			</h3>
			<p>
				From: {creditTransactions[0].date} to{' '}
				{creditTransactions[creditTransactions.length - 1].date}{' '}
			</p>
			<div className='space-y-2 mb-4'>
				<p className='text-xs text-gray-700 font-black'>
					{creditTransactions.length} Transactions
				</p>
				<p className='text-4xl font-black text-green-600 '>
					₦
					{Math.abs(expenses).toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</p>
			</div>
		</div>
	);
}
