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
		<div>
			{loadingStates.includes(status) && (
				<LoadingState status={data?.status || ''} />
			)}
			{status == 'Complete' && <ResultDashboard rawResult={data?.details} />}
			{isErrororEmpty && (
				<UploadCard isError={status == 'Failed'} sessionId={sessionId} />
			)}
		</div>
	);
}
