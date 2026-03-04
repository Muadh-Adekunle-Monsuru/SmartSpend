import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';

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
		<div className='border-4 border-black p-6 bg-white'>
			<h3 className='text-xs font-black tracking-widest uppercase mb-6 border-b-4 border-black pb-4 text-black'>
				Nigeria PAYE Tax (2026)
			</h3>
			<div className='space-y-4'>
				<div className='border-b-2 border-black pb-4'>
					<label
						htmlFor='gross'
						className='text-xs font-black uppercase tracking-widest block mb-2 text-black'
					>
						Monthly Gross Income
					</label>
					<input
						id='gross'
						type='number'
						placeholder='e.g. 500000'
						onChange={(e) => setMonthlyGross(Number(e.target.value))}
						className='w-full bg-white border-2 border-black px-3 py-2 text-sm font-black placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-orange-600'
					/>
				</div>

				<div className='border-b-2 border-black pb-4'>
					<label
						htmlFor='rent'
						className='text-xs font-black uppercase tracking-widest block mb-2 text-black'
					>
						Annual Rent Paid (Optional)
					</label>
					<input
						id='rent'
						type='number'
						placeholder='e.g. 1200000'
						onChange={(e) => setAnnualRent(Number(e.target.value))}
						className='w-full bg-white border-2 border-black px-3 py-2 text-sm font-black placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-orange-600'
					/>
					<p className='text-xs text-gray-600 mt-2'>
						20% of rent is deductible (up to ₦500k/year relief)
					</p>
				</div>

				<div className='border-b-2 border-black pb-4'>
					<label className='text-xs font-black uppercase tracking-widest block mb-2 text-black'>
						Monthly Pension (8%)
					</label>
					<div>
						<input
							type='text'
							placeholder='Auto-calculated'
							className='flex-1 bg-gray-100 border-2 border-black px-3 py-2 text-sm font-black placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-orange-600'
							disabled
							value={`-${fmt(taxCalculation.pension)}`}
						/>
					</div>
				</div>

				<div className='border-b-2 border-black pb-4'>
					<label className='text-xs font-black uppercase tracking-widest block mb-2 text-black'>
						Monthly Rent Relief Benefit
					</label>
					<div className='py-2 text-sm font-black text-green-600'>
						+{fmt(taxCalculation.rentRelief)}
					</div>
				</div>

				<div className='mt-6 space-y-3 border-t-4 border-black pt-4'>
					<div className='flex justify-between items-center'>
						<span className='text-xs font-black uppercase text-black'>
							Estimated Monthly PAYE
						</span>
						<span className='text-xl font-black text-red-600'>
							{fmt(taxCalculation.monthlyTax)}
						</span>
					</div>
					<div className='flex justify-between items-center'>
						<span className='text-xs font-black uppercase text-black'>
							Net Take-Home Pay
						</span>
						<span className='text-xl font-black text-black'>
							{fmt(taxCalculation.monthlyNet)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NigeriaTaxCalculator;
