import { DashboardHeader } from '@/components/DasboardHeader';
import Link from 'next/link';

export default function LandingPage() {
	return (
		<main className='min-h-screen bg-amber-50 text-black font-sans'>
			<DashboardHeader sessionId='' />

			<div className='min-h-[600px] flex items-center justify-center px-6 py-20'>
				<div className='max-w-6xl w-full'>
					<div className='border-4 border-black p-12 bg-white text-center '>
						<h1 className='text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight'>
							Understand Your <span className='text-orange-600'>Money.</span>{' '}
							Control Your <span className='text-red-600'>Future.</span>
						</h1>

						{/* Subheading */}
						<p className='text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto'>
							Stop squinting at complicated bank statements. SmartSpend uses AI
							to transform your transaction history into clear insights,
							automated budgets, and bite-sized lessons to help you build
							lasting wealth.
						</p>

						{/* CTA Button */}
						<Link
							href='/dashboard'
							className='inline-block bg-orange-600 text-white border-4 border-black px-8 py-4 font-black uppercase tracking-widest text-lg hover:bg-orange-700 transition-all'
						>
							Upload Your Statement
						</Link>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className='px-6 py-20 max-w-5xl mx-auto'>
				<h2 className='text-5xl font-black tracking-tight border-l-4 border-black pl-4 mb-12'>
					Why SmartSpend
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Feature 1 */}
					<div className='border-4 border-black p-8 bg-white'>
						<div className='w-12 h-12 border-4 border-orange-600 bg-orange-100 flex items-center justify-center mb-4 font-black text-orange-700 text-xl'>
							1
						</div>
						<h3 className='text-2xl font-black mb-4'>AI-Powered Insights</h3>
						<p className='text-base leading-relaxed'>
							Our AI analyzes your spending patterns and gives you actionable
							insights tailored to your financial situation.
						</p>
					</div>

					{/* Feature 2 */}
					<div className='border-4 border-black p-8 bg-white'>
						<div className='w-12 h-12 border-4 border-orange-600 bg-orange-100 flex items-center justify-center mb-4 font-black text-orange-700 text-xl'>
							2
						</div>
						<h3 className='text-2xl font-black mb-4'>
							Visual Expense Analytics
						</h3>
						<p className='text-base leading-relaxed'>
							Know exactly where your money goes. Visualize your category
							breakdowns, busiest transaction days, and largest expenses at a
							single glance.
						</p>
					</div>

					{/* Feature 3 */}
					<div className='border-4 border-black p-8 bg-white'>
						<div className='w-12 h-12 border-4 border-orange-600 bg-orange-100 flex items-center justify-center mb-4 font-black text-orange-700 text-xl'>
							3
						</div>
						<h3 className='text-2xl font-black mb-4'>Tax Optimization</h3>
						<p className='text-base leading-relaxed'>
							Calculate your tax obligations and discover deductions you might
							be missing to maximize your net income.
						</p>
					</div>

					{/* Feature 4 */}
					<div className='border-4 border-black p-8 bg-white'>
						<div className='w-12 h-12 border-4 border-orange-600 bg-orange-100 flex items-center justify-center mb-4 font-black text-orange-700 text-xl'>
							4
						</div>
						<h3 className='text-2xl font-black mb-4'>Financial Literacy</h3>
						<p className='text-base leading-relaxed'>
							Learn bite-sized financial lessons based on your actual spending
							habits. Knowledge is wealth.
						</p>
					</div>
				</div>
			</div>

			<div className='flex gap-4 mx-auto text-center w-full justify-center'>
				<p>
					Built by{' '}
					<a href='https://www.muadh.com.ng' className='underline'>
						Muadh{' '}
					</a>
				</p>
				<p>
					View on{' '}
					<a
						href='https://github.com/Muadh-Adekunle-Monsuru/SmartSpend'
						className='underline'
					>
						Github
					</a>
				</p>
			</div>
		</main>
	);
}
