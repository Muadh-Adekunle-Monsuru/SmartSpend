import { serve } from 'inngest/next';
import { inngest } from '@/inngest/client';
import { processStatement } from '@/inngest/functions';
import { extractAdditionalData } from '@/inngest/insights';

export const { GET, POST, PUT } = serve({
	client: inngest,
	functions: [processStatement, extractAdditionalData],
});
