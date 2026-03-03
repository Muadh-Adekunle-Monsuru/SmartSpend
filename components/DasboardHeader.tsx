export function DashboardHeader() {
	return (
		<header className='border-b-4 border-black bg-amber-50 sticky top-0 z-50'>
			<div className='max-w-[1600px] mx-auto px-6 md:px-8 py-6 flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<div className='w-12 h-12 bg-orange-600 border-4 border-black flex items-center justify-center'>
						<span className='text-white font-black text-xl'>$</span>
					</div>
					<h1 className='text-2xl md:text-3xl font-black tracking-tighter text-black'>
						SMARTSPEND
					</h1>
				</div>
				<div className='flex items-center gap-6'>
					<button className='text-xs font-black uppercase tracking-widest border-4 border-black px-4 py-2 hover:bg-black hover:text-amber-50 transition-all'>
						Settings
					</button>
					<button className='text-xs font-black uppercase tracking-widest bg-red-600 text-white border-4 border-black px-4 py-2 hover:bg-red-700 transition-all'>
						Export
					</button>
				</div>
			</div>
		</header>
	);
}
