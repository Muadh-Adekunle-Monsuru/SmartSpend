import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	transactions: defineTable({
		sessionId: v.string(),
		details: v.array(
			v.object({
				amount: v.number(),
				category: v.string(),
				date: v.string(),
				description: v.string(),
				type: v.string(),
			}),
		),
	}),
});
