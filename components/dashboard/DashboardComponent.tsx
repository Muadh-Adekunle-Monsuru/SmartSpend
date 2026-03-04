'use client';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import LoadingState from './LoadingState';
import ResultDashboard from './ResultDashboard';
import UploadCard from './UploadCard';
export default function DashboardComponent({
	sessionId,
}: {
	sessionId: string;
}) {
	const data = useQuery(api.convexFunctions.getRecordBySession, { sessionId });
	const status = data?.status || '';
	const loadingStates = ['Parsing', 'Submitted', 'Cleaning'];
	const isErrororEmpty = !status || status == 'Failed';
	return (
		<div className='p-3 flex flex-1 items-center justify-center md:p-6'>
			{loadingStates.includes(status) && (
				<LoadingState status={data?.status || ''} />
			)}
			{status == 'Complete' && (
				<ResultDashboard rawResult={data?.details} insights={data?.insights} />
			)}
			{isErrororEmpty && (
				<UploadCard isError={status == 'Failed'} sessionId={sessionId} />
			)}
		</div>
	);
}
