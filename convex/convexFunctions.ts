import { mutation, internalMutation, query } from './_generated/server';
import { v } from 'convex/values';

export const saveCategorized = mutation({
	args: {
		transactions: v.array(v.any()),
		sessionId: v.string(),
	},
	handler: async (ctx, args) => {
		const existingRecord = await ctx.db
			.query('transactions')
			.withIndex('by_sessionId', (q) => q.eq('sessionId', args.sessionId))
			.first();

		if (existingRecord) {
			await ctx.db.patch(existingRecord._id, {
				details: args.transactions,
			});

			return { success: true, action: 'updated', id: existingRecord._id };
		}
	},
});

export const updateRecordBySession = mutation({
	args: {
		sessionId: v.string(),
		newStatus: v.string(),
	},
	handler: async (ctx, args) => {
		const existingRecord = await ctx.db
			.query('transactions')
			.withIndex('by_sessionId', (q) => q.eq('sessionId', args.sessionId))
			.first();

		if (existingRecord) {
			await ctx.db.patch(existingRecord._id, {
				status: args.newStatus,
			});

			return { success: true, action: 'updated', id: existingRecord._id };
		}

		const newId = await ctx.db.insert('transactions', {
			sessionId: args.sessionId,
			status: args.newStatus,
		});

		return { success: true, action: 'created', id: newId };
	},
});

export const getRecordBySession = query({
	args: {
		sessionId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query('transactions')
			.withIndex('by_sessionId', (q) => q.eq('sessionId', args.sessionId))
			.first();
	},
});
