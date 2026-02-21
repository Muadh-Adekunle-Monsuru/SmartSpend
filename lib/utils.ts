import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const TransactionSchema = z.object({
	date: z.string().describe('ISO format date (YYYY-MM-DD)'),
	description: z
		.string()
		.describe(
			"Cleaned merchant name, e.g., 'MTN Airtime' instead of 'BAP:CD/MTN'",
		),
	amount: z.number(),
	type: z.enum(['debit', 'credit']),
	category: z
		.string()
		.describe('Food, Transport, Subscriptions, Transfer, Salary, or Income'),
});

export type Transaction = z.infer<typeof TransactionSchema>;
