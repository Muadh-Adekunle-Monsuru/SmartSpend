import { Transaction } from '@/lib/utils';

export default function LargestDebit({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const debitTransactions =
		rawResult
			?.filter((transaction) => transaction.type.toLowerCase() == 'debit')
			.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any)) ||
		[];
	const largest = debitTransactions.reduce((val, s) => {
		if (s.amount < val) {
			return s.amount;
		}
		return val;
	}, 0);
	return (
		<div className='border-4 border-black p-6 bg-white'>
			<h3 className='text-xs font-black tracking-widest uppercase mb-6 border-b-4 border-black pb-4'>
				Largest Expense
			</h3>
			<div className='text-xs text-gray-700 uppercase tracking-wider mb-4'>
				Made on:{' '}
				{
					debitTransactions.find((transaction) => transaction.amount == largest)
						?.date
				}
			</div>
			<p className='text-lg font-black mb-3'>
				{
					debitTransactions.find((transaction) => transaction.amount == largest)
						?.description
				}
			</p>
			<p className='text-3xl font-black text-red-500'>
				₦
				{Math.abs(largest).toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}
			</p>
		</div>
	);
}
