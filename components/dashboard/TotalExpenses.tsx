import { Transaction } from '@/lib/utils';

export default function TotalExpenses({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const debitTransactions =
		rawResult
			?.filter((transaction) => transaction.type.toLowerCase() == 'debit')
			.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any)) ||
		[];

	const expenses = debitTransactions?.reduce(
		(sum, s) => (sum = sum + s.amount),
		0,
	);

	return (
		<div className='border-4 border-black p-6 bg-white'>
			<h3 className='text-xs font-black tracking-widest uppercase mb-6 border-b-4 border-black pb-4 text-black'>
				Total Expenses
			</h3>
			<p className='text-xs text-gray-700 uppercase tracking-wider mb-4'>
				From: {debitTransactions[0]?.date} to{' '}
				{debitTransactions[debitTransactions.length - 1]?.date}{' '}
			</p>
			<p className='text-4xl font-black text-red-600'>
				₦
				{Math.abs(expenses).toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}
			</p>
		</div>
	);
}
