import { Transaction } from '@/lib/utils';
import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';

export default function LargestDebit({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const debitTransactions =
		rawResult
			?.filter((transaction) => transaction.type.toLowerCase() == 'debit')
			.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any)) ||
		[];
	const largest = debitTransactions.reduce((val, s) => {
		if (s.amount < val) {
			return s.amount;
		}
		return val;
	}, 0);
	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Largest Expense</CardTitle>
				<CardDescription>
					Made on:{' '}
					{
						debitTransactions.find(
							(transaction) => transaction.amount == largest,
						)?.date
					}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className='text-lg font-medium max-w-xs'>
					{' '}
					{
						debitTransactions.find(
							(transaction) => transaction.amount == largest,
						)?.description
					}
				</p>
				<p className='text-xl font-bold text-red-500'>
					₦
					{Math.abs(largest).toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</p>
			</CardContent>
		</Card>
	);
}
