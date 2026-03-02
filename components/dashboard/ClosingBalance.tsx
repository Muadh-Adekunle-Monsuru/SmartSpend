import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Transaction } from '@/lib/utils';

export default function ClosingBalance({
	rawResult,
}: {
	rawResult?: Transaction[];
}) {
	const sortedTransactions =
		rawResult?.sort(
			(a, b) => (new Date(a.date) as any) - (new Date(b.date) as any),
		) || [];

	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle>Closing Balance</CardTitle>
				<CardDescription>
					Date: {sortedTransactions[sortedTransactions.length - 1].date}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className='text-xl font-bold '>
					₦
					{Math.abs(
						sortedTransactions[sortedTransactions.length - 1].balance || 0,
					).toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</p>
			</CardContent>
		</Card>
	);
}
