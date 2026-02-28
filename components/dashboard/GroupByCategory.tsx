'use client';
import { Transaction } from '@/lib/utils';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { Pie, PieChart } from 'recharts';

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart';

export default function GroupByCategory({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	interface CategoryTotals {
		[key: string]: number;
	}
	const groups = rawResult?.reduce((group: CategoryTotals, trans) => {
		group[trans.category] = (group[trans.category] || 0) + trans.amount;
		return group;
	}, {});

	const ChartData = Object.entries(groups as any).map((val) => {
		return {
			category: val[0],
			value: Math.abs(val[1] as number),
		};
	});

	const chartConfig = {
		value: {
			label: 'Amount',
		},
		internalTransfer: {
			label: 'Internal Transfer',
			color: 'var(--chart-1)',
		},
		utilities: {
			label: 'Utilities',
			color: 'var(--chart-2)',
		},
		savings: {
			label: 'Savings',
			color: 'var(--chart-3)',
		},
		transfer: {
			label: 'Transfer',
			color: 'var(--chart-4)',
		},
		shoppingRetail: {
			label: 'Shopping/Retail',
			color: 'var(--chart-5)',
		},
		income: {
			label: 'Income',
			color: 'var(--chart-1)',
		},
		bankFees: {
			label: 'Bank Fees',
			color: 'var(--chart-2)',
		},
		airtimeData: {
			label: 'Airtime/Data',
			color: 'var(--chart-3)',
		},
		giftPersonal: {
			label: 'Gift/Personal',
			color: 'var(--chart-4)',
		},
		businessIncome: {
			label: 'Business Income',
			color: 'var(--chart-5)',
		},
	} satisfies ChartConfig;

	return (
		<Card className='w-full flex flex-col'>
			<CardHeader>
				<CardTitle>Category Breakdown</CardTitle>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer
					config={chartConfig}
					className='mx-auto aspect-square max-h-[450px]'
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie data={ChartData} dataKey='value' label nameKey='category' />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
