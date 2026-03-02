import { inngest } from './client';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
const schema: Schema = {
	type: SchemaType.ARRAY,
	description: 'Financial insights',
	items: {
		type: SchemaType.OBJECT,
		properties: {
			title: { type: SchemaType.STRING },
			description: { type: SchemaType.STRING },
		},
		required: ['title', 'description'],
	},
} as const;

const agent_prompt = `
You are an expert, empathetic personal finance assistant. Your job is to analyze the user's raw bank transaction data for a specific month and generate exactly 5 natural language financial insights.

Your tone should be helpful, direct, and encouraging. Do not use financial jargon; speak to the user like a smart friend.

Calculate the totals for income, expenses, fees, and savings to inform your insights. 

Return your response strictly as a JSON object matching this structure, with no markdown formatting or extra text:
{
  "insights": [
    {
      "title": "Savings Rate",
      "description": "A 1-2 sentence insight about how much they saved compared to their income."
    },
    {
      "title": "Hidden Fees",
      "description": "A 1-2 sentence insight about the total cost of bank charges, stamp duties, and VAT."
    },
    {
      "title": "Income Sources",
      "description": "A 1-2 sentence insight summarizing their primary sources of income this month."
    },
    {
      "title": "Transfer Activity",
      "description": "A 1-2 sentence insight about how much money was transferred out to other people."
    },
    {
      "title": "Cash Flow Health",
      "description": "A concluding 1-2 sentence insight on whether they spent more than they earned."
    }
  ]
}
Analyze the following JSON array of transactions:

`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export const extractAdditionalData = inngest.createFunction(
	{
		id: 'extract-additional-data',
		retries: 1,
	},
	{ event: 'extract/additional' },
	async ({ event, step }) => {
		const { rawResults, cleanTransactions, sessionId } = event.data;

		const model = genAI.getGenerativeModel({
			model: 'gemini-2.5-flash',
			generationConfig: {
				responseMimeType: 'application/json',
				responseSchema: schema,
			},
		});

		const insightAgent = async (markdown: string) => {
			const prompt = `
				${agent_prompt} 
			    ${JSON.stringify(markdown)}
				`;

			const result = await model.generateContent(prompt);
			try {
				const parsed = JSON.parse(result.response.text());
				return parsed;
			} catch (err) {
				throw new Error('Gemini returned invalid JSON');
			}
		};

		const extractMetaData = await step.run('extract-metadata', async () => {
			return await insightAgent(cleanTransactions);
		});

		await fetchMutation(api.convexFunctions.setInsights, {
			insights: extractMetaData,
			sessionId,
		});
		return { status: 'SUCCESS' };
	},
);
