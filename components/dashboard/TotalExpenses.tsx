import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Transaction } from '@/lib/utils';

export default function TotalExpenses({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const debitTransactions =
		rawResult
			?.filter((transaction) => transaction.type.toLowerCase() == 'debit')
			.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any)) ||
		[];

	const expenses = debitTransactions?.reduce(
		(sum, s) => (sum = sum + s.amount),
		0,
	);

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Total Expenses</CardTitle>
				<CardDescription>
					From: {debitTransactions[0].date} to{' '}
					{debitTransactions[debitTransactions.length - 1].date}{' '}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className='text-xl font-bold text-red-500'>
					₦
					{Math.abs(expenses).toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</p>
			</CardContent>
		</Card>
	);
}
