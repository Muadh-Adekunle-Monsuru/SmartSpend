import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const NigeriaTaxCalculator = () => {
	const [monthlyGross, setMonthlyGross] = useState<number>(0);
	const [annualRent, setAnnualRent] = useState<number>(0);

	const taxCalculation = useMemo(() => {
		const annualGross = monthlyGross * 12;

		// 1. STATUTORY DEDUCTIONS
		// Pension is typically 8% of Basic + Housing + Transport.
		// For a rough calc, we use 8% of Gross unless specified.
		const pension = annualGross * 0.08;

		// 2. RENT RELIEF (NTA 2025)
		// 20% of annual rent, capped at ₦500,000
		const calculatedRentRelief = annualRent * 0.2;
		const actualRentRelief = Math.min(calculatedRentRelief, 500000);

		// 3. CHARGEABLE INCOME
		const totalDeductions = pension + actualRentRelief;
		const chargeableIncome = Math.max(0, annualGross - totalDeductions);

		// 4. PROGRESSIVE TAX BANDS (2026 RATES)
		const bands = [
			{ limit: 800000, rate: 0.0 }, // First 800k (Tax-Free)
			{ limit: 2200000, rate: 0.15 }, // Next 2.2m
			{ limit: 9000000, rate: 0.18 }, // Next 9m
			{ limit: 13000000, rate: 0.21 }, // Next 13m
			{ limit: 25000000, rate: 0.23 }, // Next 25m
			{ limit: Infinity, rate: 0.25 }, // Above 50m total
		];

		let remainingIncome = chargeableIncome;
		let totalAnnualTax = 0;

		for (const band of bands) {
			if (remainingIncome <= 0) break;
			const taxableInBand = Math.min(remainingIncome, band.limit);
			totalAnnualTax += taxableInBand * band.rate;
			remainingIncome -= taxableInBand;
		}

		const monthlyTax = totalAnnualTax / 12;
		const monthlyNet = monthlyGross - pension / 12 - monthlyTax;

		return {
			annualGross,
			pension: pension / 12,
			rentRelief: actualRentRelief / 12,
			taxableMonthly: chargeableIncome / 12,
			monthlyTax,
			monthlyNet,
		};
	}, [monthlyGross, annualRent]);

	const fmt = (val: number) =>
		new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
		}).format(val);

	return (
		<Card className='w-full '>
			<CardHeader>
				<CardTitle className='text-xl'>Nigeria PAYE Tax (2026)</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='gross'>Monthly Gross Income</Label>
					<Input
						id='gross'
						type='number'
						placeholder='e.g. 500000'
						onChange={(e) => setMonthlyGross(Number(e.target.value))}
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='rent'>Annual Rent Paid (Optional)</Label>
					<Input
						id='rent'
						type='number'
						placeholder='e.g. 1200000'
						onChange={(e) => setAnnualRent(Number(e.target.value))}
					/>
					<p className='text-xs text-muted-foreground'>
						20% of rent is deductible (up to ₦500k/year relief)
					</p>
				</div>

				<hr className='my-4' />

				<div className='space-y-3 text-sm'>
					<div className='flex justify-between'>
						<span>Monthly Pension (8%)</span>
						<span className='font-medium text-red-500'>
							-{fmt(taxCalculation.pension)}
						</span>
					</div>
					<div className='flex justify-between'>
						<span>Monthly Rent Relief Benefit</span>
						<span className='font-medium text-green-600'>
							+{fmt(taxCalculation.rentRelief)}
						</span>
					</div>
					<div className='flex justify-between border-t pt-2 font-bold'>
						<span>Estimated Monthly PAYE</span>
						<span className='text-red-600'>
							{fmt(taxCalculation.monthlyTax)}
						</span>
					</div>
					<div className='flex justify-between bg-primary/10 p-2 rounded-lg text-lg font-bold'>
						<span>Net Take-Home Pay</span>
						<span className='text-primary'>
							{fmt(taxCalculation.monthlyNet)}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default NigeriaTaxCalculator;
