import { Transaction } from '@/lib/utils';
import React from 'react';
import RawResultDisplay from './RawResultDisplay';
import TotalExpenses from './TotalExpenses';
import TotalIncome from './TotalIncome';
import LargestDebit from './LargestDebit';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import LargestCredit from './LargestIncome';
import GroupByCategory from './GroupByCategory';

export default function ResultDashboard({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const sorted =
		rawResult?.sort(
			(a, b) => (new Date(a.date) as any) - (new Date(b.date) as any),
		) || [];
	return (
		<div>
			<p className='text-4xl font-bold py-3 text-muted-foreground'>
				{new Date(sorted[0]?.date).toLocaleDateString()} -{' '}
				{new Date(sorted.at(-1)?.date!).toLocaleDateString()}
			</p>
			<ResponsiveMasonry
				columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
				gutterBreakPoints={{ 350: '12px', 750: '16px', 900: '16px' }}
			>
				<Masonry>
					<RawResultDisplay rawResult={rawResult} />
					<TotalExpenses rawResult={rawResult} />
					<TotalIncome rawResult={rawResult} />
					<LargestDebit rawResult={rawResult} />
					<LargestCredit rawResult={rawResult} />
					<GroupByCategory rawResult={rawResult} />
				</Masonry>
			</ResponsiveMasonry>
		</div>
	);
}
