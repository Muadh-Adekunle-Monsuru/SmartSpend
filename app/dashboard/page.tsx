import DashboardComponent from '@/components/dashboard/DashboardComponent';
import LoadingComponent from '@/components/dashboard/DashboardComponent';
import UploadCard from '@/components/dashboard/UploadCard';

import { cookies } from 'next/headers';

export default async function Page() {
	const cookieStore = await cookies();
	const sessionId = cookieStore.get('sessionId')?.value;

	if (!sessionId) {
		return <div>Loading session...</div>;
	}

	return (
		<div className='lg:p-20 flex flex-col justify-center  w-full h-screen bg-linear-to-b from-[#fdfcfb] to-[#e2d1c3]'>
			<DashboardComponent sessionId={sessionId} />
		</div>
	);
}
