import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Transaction } from '@/lib/utils';

export default function TotalIncome({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const creditTransactions =
		rawResult
			?.filter((transaction) => transaction.type.toLowerCase() == 'credit')
			.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any)) ||
		[];

	const expenses = creditTransactions?.reduce(
		(sum, s) => (sum = sum + s.amount),
		0,
	);

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Total Expenses</CardTitle>
				<CardDescription>
					From: {creditTransactions[0].date} t0{' '}
					{creditTransactions[creditTransactions.length - 1].date}{' '}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{creditTransactions.length} Transactions</p>
				<p className='text-xl font-bold text-green-500 '>
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
