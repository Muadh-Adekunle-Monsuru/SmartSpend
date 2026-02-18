import { inngest } from './client';

export const processStatement = inngest.createFunction(
	{ id: 'process-bank-statement' },
	{ event: 'statement/uploaded' },
	async ({ event, step }) => {
		const { fileUrl, userId } = event.data;

		// Step 1: Extract PDF to Structured JSON
		const rawData = await step.run('extract-pdf-data', async () => {
			// call Document AI or LlamaParse here
			return { transactions: [] };
		});

		// Step 2: Agentic Deduplication (Clue-finding)
		const cleanData = await step.run('deduplicate-transactions', async () => {
			// AI logic to find repeating patterns
			return rawData.transactions;
		});

		// Step 3: AI Categorization
		const categorized = await step.run('categorize-spending', async () => {
			// Use description to map categories
			return cleanData;
		});

		return { status: 'success', count: categorized.length };
	},
);
