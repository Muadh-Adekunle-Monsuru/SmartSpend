import { inngest } from './client';

export const processStatement = inngest.createFunction(
	{ id: 'process-bank-statement', retries: 2 },
	{ event: 'statement/uploaded' },
	async ({ event, step }) => {
		const { fileUrl } = event.data;

		// 1. INITIATE PARSE JOB
		const jobId = await step.run('initiate-llamaparse', async () => {
			const response = await fetch(
				'https://api.cloud.llamaindex.ai/api/v2/parse',
				{
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${process.env.LLAMA_CLOUD_API_KEY}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						source_url: fileUrl,
						tier: 'cost_effective',
						version: 'latest',
					}),
				},
			);
			const data = await response.json();
			return data.id;
		});

		// 2. POLLING LOOP (Wait for Completion)
		let status = 'PENDING';
		let markdownOutput = '';

		while (status !== 'COMPLETED' && status !== 'FAILED') {
			await step.sleep('polling-delay', '10s'); // Wait 3 seconds between checks

			const result = await step.run('check-parse-status', async () => {
				const response = await fetch(
					`https://api.cloud.llamaindex.ai/api/v2/parse/${jobId}?expand=markdown`,
					{
						headers: {
							'Authorization': `Bearer ${process.env.LLAMA_CLOUD_API_KEY}`,
						},
					},
				);
				return await response.json();
			});

			status = result.job.status;
			if (status === 'COMPLETED') {
				markdownOutput = result.markdown.pages
					.map((p: any) => p.markdown)
					.join('\n\n');
			}
		}

		if (status === 'FAILED') {
			throw new Error('LlamaParse failed to process the document.');
		}

		// 3. NEXT STEP: Hand off to the Cleaning Agent
		return { status: 'SUCCESS', dataLength: markdownOutput.length };
	},
);
