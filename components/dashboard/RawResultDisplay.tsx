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
		<div className='border-4 border-black p-6 bg-white'>
			<h2 className='text-xs font-black tracking-widest uppercase mb-1 text-black'>
				Transactions
			</h2>
			<p className='text-xs text-gray-700 uppercase tracking-wider mb-6 border-b-4 border-black pb-4'>
				Your recent transactions
			</p>

			<div className='space-y-4 max-h-72 overflow-auto'>
				{!rawResult || rawResult.length === 0 ? (
					<p className='text-sm text-gray-500 text-center py-4'>
						No transactions found.
					</p>
				) : (
					rawResult.map((transaction, index) => (
						<div
							key={`${transaction.date}-${index}`}
							className={`border-l-4 ${
								transaction.type.toLowerCase() === 'credit'
									? 'border-green-600'
									: 'border-orange-600'
							}  pl-4 pb-4 last:pb-0`}
						>
							<h4 className='text-sm font-black leading-tight mb-2 text-black'>
								{transaction.description}
							</h4>
							<div className='flex justify-between items-start mb-2'>
								<span className='text-xs text-gray-600 uppercase tracking-wider'>
									{transaction.date} • {transaction.type}
								</span>
								<div
									className={`flex text-sm font-black  ${
										transaction.type.toLowerCase() === 'credit'
											? 'text-green-600'
											: 'text-red-600'
									}`}
								>
									<span>{transaction.type === 'credit' ? '+' : ''}</span>
									<span>
										₦
										{Math.abs(transaction.amount).toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</span>
								</div>
							</div>
							<div className='text-xs text-gray-600 text-right'>
								₦
								{Math.abs(transaction.balance || 0).toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
