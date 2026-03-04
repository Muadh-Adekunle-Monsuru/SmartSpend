'use client';
import { Transaction } from '@/lib/utils';
import { Pie, PieChart } from 'recharts'; // Added Cell for individual coloring

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
		<div className='border-4 border-black p-6 bg-white'>
			<h2 className='text-xs font-black tracking-widest uppercase border-b-4 border-black pb-4 text-black'>
				Category Breakdown
			</h2>
			<div className='w-full'>
				<ChartContainer
					config={dynamicConfig}
					className='mx-auto aspect-square max-h-[350px]'
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey='value'
							nameKey={'browser'}
							strokeWidth={2}
							innerRadius={60}
							outerRadius={100}
							paddingAngle={2}
							stroke='#000000'
						/>
						<ChartLegend
							content={<ChartLegendContent nameKey='browser' />}
							className='-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center'
						/>
					</PieChart>
				</ChartContainer>
			</div>
		</div>
	);
}
