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
import MostTransactionDay from './MostTransactionDay';
import NigeriaTaxCalculator from './TaxCard';

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
		<div className='p-6 md:p-8 max-w-[1600px] mx-auto'>
			<div className='mb-8'>
				<h1 className='text-4xl md:text-5xl font-black tracking-tight border-l-4 border-black pl-4'>
					{new Date(sorted[0]?.date).toLocaleDateString()} -{' '}
					{new Date(sorted.at(-1)?.date!).toLocaleDateString()}
				</h1>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max'>
				<div className='flex flex-col gap-6'>
					<RawResultDisplay rawResult={rawResult} />
					<TotalIncome rawResult={rawResult} />
					<LargestDebit rawResult={rawResult} />
					{insights && insights?.length > 0 && <Insights insights={insights} />}
				</div>
				<div className='flex flex-col gap-6'>
					<GroupByCategory rawResult={rawResult} />
					<BalanceChart rawResult={rawResult} />
					<OpeningBalance rawResult={rawResult} />
					<ClosingBalance rawResult={rawResult} />
				</div>
				<div className='flex flex-col gap-6'>
					<TotalExpenses rawResult={rawResult} />
					<MostTransactionDay rawResult={rawResult} />
					<LargestCredit rawResult={rawResult} />
					<NigeriaTaxCalculator />
				</div>
			</div>
		</div>
	);
}
