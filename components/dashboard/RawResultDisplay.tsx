import { Transaction } from '@/lib/utils';
import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';

export default function RawResultDisplay({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	return (
		<Card className='w-full max-w-2xl max-h-80'>
			<CardHeader>
				<CardTitle>Spendings</CardTitle>
				<CardDescription>Your recent transactions</CardDescription>
			</CardHeader>

			<CardContent className='space-y-4 max-h-72 overflow-auto'>
				{!rawResult || rawResult.length === 0 ? (
					<p className='text-sm text-gray-500 text-center py-4'>
						No transactions found.
					</p>
				) : (
					rawResult.map((transaction, index) => (
						<div
							key={`${transaction.date}-${index}`}
							className='flex items-center justify-between p-3 border rounded-lg bg-slate-50/50'
						>
							{/* Left side: Description and Date */}
							<div className='flex flex-col'>
								<span className='font-medium text-sm text-gray-900'>
									{transaction.description}
								</span>
								<span className='text-xs text-gray-500'>
									{transaction.date} • {transaction.category}
								</span>
							</div>

							{/* Right side: Amount (Colored by credit/debit) */}
							<div
								className={`font-semibold text-sm ${
									transaction.type === 'Credit'
										? 'text-green-600'
										: 'text-red-600'
								}`}
							>
								{transaction.type === 'credit' ? '+' : ''}
								{/* Formats the number with commas (e.g., 50,000) */}₦
								{Math.abs(transaction.amount).toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}
