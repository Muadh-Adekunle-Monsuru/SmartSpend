'use client';
import { Transaction } from '@/lib/utils';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Pie, PieChart, Cell } from 'recharts'; // Added Cell for individual coloring

import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
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

	const groups =
		rawResult?.reduce((group: CategoryTotals, trans) => {
			const category = trans.category || 'Uncategorized';
			group[category] = (group[category] || 0) + Math.abs(trans.amount);
			return group;
		}, {}) || {};

	const dynamicConfig: ChartConfig = {
		value: { label: 'Amount' },
	};

	const chartData = Object.entries(groups).map(([category, value], index) => {
		// Create a clean key for the config (camelCase or kebab-case)
		const configKey = category.toLowerCase().replace(/[^a-z0-9]/g, '');

		// Cycle through the 5 default Shadcn chart colors
		const colorIndex = (index % 5) + 1;

		// Add to config dynamically
		dynamicConfig[configKey] = {
			label: category,
			color: `var(--chart-${colorIndex})`,
		};

		return {
			category,
			value,
			fill: `var(--color-${configKey})`, // Shadcn uses --color-{key} based on config
			browser: configKey,
		};
	});

	return (
		<Card className='w-full flex flex-col'>
			<CardHeader>
				<CardTitle>Category Breakdown</CardTitle>
			</CardHeader>
			<CardContent className='flex-1 pb-0'>
				<ChartContainer
					config={dynamicConfig}
					className='mx-auto aspect-square max-h-[450px]'
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey='value'
							label
							nameKey={'browser'}
							strokeWidth={5}
						/>
						<ChartLegend
							content={<ChartLegendContent nameKey='browser' />}
							className='-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center'
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
