import BlobBGGradient from '@/components/BlobBGGradient';
import { ComponentExample } from '@/components/component-example';
import MeshBG from '@/components/MeshGradient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
	return (
		<div className='bg-black flex h-screen justify-center items-center p-10'>
			<div className='z-10 text-white max-w-4xl text-center flex flex-col items-center justify-center gap-5'>
				<p className='text-neutral-300 font-black text-3xl lg:text-7xl'>
					Understand Your Money, Control Your Future.
				</p>
				<p className='text-lg lg:text-xl max-w-xl text-neutral-50'>
					Stop squinting at complicated bank statements. SmartSpend uses AI to
					transform your transaction history into clear insights, automated
					budgets, and bite-sized lessons to help you build lasting wealth.
				</p>
				<Link href={'/dashboard'}>
					<Button className=' p-5 ' size='lg'>
						Upload Your First Statement
					</Button>
				</Link>
			</div>
			<BlobBGGradient />
		</div>
	);
}
