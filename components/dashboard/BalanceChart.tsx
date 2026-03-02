'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart';
import { Transaction } from '@/lib/utils';

export const description = 'An interactive line chart';

const chartConfig = {
	views: {
		label: 'Account Balance',
	},
	balance: {
		label: 'Balance',
		color: 'var(--chart-1)',
	},
} satisfies ChartConfig;

export function BalanceChart({ rawResult }: { rawResult?: Transaction[] }) {
	const total = rawResult?.length;

	return (
		<Card className='py-4 sm:py-0 w-full'>
			<CardHeader className='flex flex-col items-stretch border-b p-0! sm:flex-row'>
				<div className='flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0'>
					<CardTitle>Balance Chart </CardTitle>
					<CardDescription></CardDescription>
				</div>
			</CardHeader>
			<CardContent className='px-2 sm:p-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-[250px] w-full'
				>
					<LineChart
						accessibilityLayer
						data={rawResult}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='date'
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
								});
							}}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className='w-[150px]'
									nameKey='views'
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
										});
									}}
								/>
							}
						/>
						<Line
							dataKey={'balance'}
							type='monotone'
							stroke={`var(--color-balance)`}
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
