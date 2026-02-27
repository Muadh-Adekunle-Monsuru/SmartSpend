import { Transaction } from '@/lib/utils';
import React from 'react';
import RawResultDisplay from './RawResultDisplay';
import TotalExpenses from './TotalExpenses';
import TotalIncome from './TotalIncome';
import LargestDebit from './LargestDebit';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import LargestCredit from './LargestIncome';

export default function ResultDashboard({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	return (
		<ResponsiveMasonry
			columnsCountBreakPoints={{ 350: 1, 750: 3, 900: 3 }}
			gutterBreakPoints={{ 350: '12px', 750: '16px', 900: '16px' }}
		>
			<Masonry>
				<RawResultDisplay rawResult={rawResult} />
				<TotalExpenses rawResult={rawResult} />
				<TotalIncome rawResult={rawResult} />
				<LargestDebit rawResult={rawResult} />
				<LargestCredit rawResult={rawResult} />
			</Masonry>
		</ResponsiveMasonry>
	);
}
