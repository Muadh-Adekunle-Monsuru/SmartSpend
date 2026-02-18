import UploadCard from '@/components/dashboard/UploadCard';
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field, FieldLabel } from '@base-ui/react';
import React from 'react';

export default function Page() {
	return (
		<div className='px-20 flex w-full h-screen justify-center items-center bg-linear-to-t from-[#f5f7fa] to-[#c3cfe2]'>
			<UploadCard />
		</div>
	);
}
