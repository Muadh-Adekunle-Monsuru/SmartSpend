'use client';
import React from 'react';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import UploadCard from './UploadCard';
import LoadingState from './LoadingState';
import RawResultDisplay from './RawResultDisplay';
export default function DashboardComponent({
	sessionId,
}: {
	sessionId: string;
}) {
	const data = useQuery(api.convexFunctions.getRecordBySession, { sessionId });
	return (
		<div>
			{data?.status && data?.status !== 'Uploaded' && (
				<LoadingState status={data?.status || ''} />
			)}
			<RawResultDisplay rawResult={data?.details} />
			{!data?.status && <UploadCard sessionId={sessionId} />}
		</div>
	);
}
