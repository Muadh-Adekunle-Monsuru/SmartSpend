import { Transaction } from '@/lib/utils';
import React from 'react';
import RawResultDisplay from './RawResultDisplay';
import TotalExpenses from './TotalExpenses';
import TotalIncome from './TotalIncome';
import LargestDebit from './LargestDebit';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import LargestCredit from './LargestIncome';
import GroupByCategory from './GroupByCategory';
import OpeningBalance from './OpeningBalance';
import ClosingBalance from './ClosingBalance';
import { BalanceChart } from './BalanceChart';
import Insights from './Insights';

export default function ResultDashboard({
	rawResult,
	insights,
}: {
	rawResult?: Transaction[];
	insights?: { description: string; title: string }[];
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
					<GroupByCategory rawResult={rawResult} />
					<TotalExpenses rawResult={rawResult} />
					<TotalIncome rawResult={rawResult} />
					<BalanceChart rawResult={rawResult} />
					<LargestDebit rawResult={rawResult} />
					<OpeningBalance rawResult={rawResult} />
					<LargestCredit rawResult={rawResult} />
					{insights && insights?.length > 0 && <Insights insights={insights} />}
					<ClosingBalance rawResult={rawResult} />
				</Masonry>
			</ResponsiveMasonry>
		</div>
	);
}
