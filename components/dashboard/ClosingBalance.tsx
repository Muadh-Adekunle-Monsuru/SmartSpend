import { Transaction } from '@/lib/utils';

export default function ClosingBalance({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const sortedTransactions =
		rawResult?.sort(
			(a, b) => (new Date(a.date) as any) - (new Date(b.date) as any),
		) || [];

	return (
		<div className='border-4 border-black p-6 bg-white'>
			<h3 className='text-xs font-black tracking-widest uppercase mb-6 border-b-4 border-black pb-4 text-black'>
				Closing Balance
			</h3>
			<p className='text-xs text-gray-700 uppercase tracking-wider mb-4'>
				Date: {sortedTransactions[sortedTransactions.length - 1]?.date}
			</p>
			<p className='text-4xl font-black text-black'>
				₦
				{Math.abs(
					sortedTransactions[sortedTransactions.length - 1].balance || 0,
				).toLocaleString(undefined, {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}
			</p>
		</div>
	);
}
