import { DashboardHeader } from '@/components/DasboardHeader';
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
		<div className=' flex flex-col min-h-screen bg-amber-50'>
			<DashboardHeader />
			<DashboardComponent sessionId={sessionId} />
		</div>
	);
}
