'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

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
		<div className='border-4 border-black p-6 bg-white'>
			<h2 className='text-xs font-black tracking-widest uppercase mb-6 border-b-4 border-black pb-4 text-black'>
				Balance Chart
			</h2>
			<div className='w-full h-48 flex items-center justify-center'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-48 w-full'
				>
					<LineChart
						accessibilityLayer
						data={rawResult}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid
							vertical={false}
							strokeDasharray='0'
							stroke='#000000'
						/>
						<XAxis
							dataKey='date'
							stroke='#666666'
							tick={{ fontSize: 12, fontWeight: 700, fill: '#000000' }}
							tickLine={true}
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
						/>{' '}
						<YAxis
							stroke='#666666'
							tick={{ fontSize: 12, fontWeight: 700, fill: '#000000' }}
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
							stroke={`#ea580c`}
							strokeWidth={4}
							dot={{ fill: '#ea580c', r: 6, strokeWidth: 2, stroke: '#000000' }}
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ChartContainer>
			</div>
		</div>
	);
}
