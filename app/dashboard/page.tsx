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
		<div className='p-20 flex flex-col w-full h-screen bg-linear-to-b from-[#f5f7fa] to-[#c3cfe2]'>
			<DashboardComponent sessionId={sessionId} />
		</div>
	);
}
