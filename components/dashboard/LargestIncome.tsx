import { Transaction } from '@/lib/utils';

export default function LargestCredit({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const creditTransactions =
		rawResult
			?.filter((transaction) => transaction.type.toLowerCase() == 'credit')
			.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any)) ||
		[];
	const largest = creditTransactions.reduce((val, s) => {
		if (s.amount > val) {
			return s.amount;
		}
		return val;
	}, 0);
	return (
		<div className='border-4 border-black p-6 bg-white'>
			<h3 className='text-xs font-black tracking-widest uppercase mb-6 border-b-4 border-black pb-4'>
				Largest Credit
			</h3>
			<p className='text-xs text-gray-700 uppercase tracking-wider mb-4'>
				Made on:{' '}
				{
					creditTransactions.find(
						(transaction) => transaction.amount == largest,
					)?.date
				}
			</p>
			<p className='text-lg font-black mb-3'>
				{' '}
				{
					creditTransactions.find(
						(transaction) => transaction.amount == largest,
					)?.description
				}
			</p>
			<p className='text-3xl font-black text-green-500'>
				₦
				{Math.abs(largest).toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}
			</p>
		</div>
	);
}
