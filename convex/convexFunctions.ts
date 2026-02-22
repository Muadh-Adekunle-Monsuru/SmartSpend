import { mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';

// Mutation to save your parsed JSON
export const saveCategorized = mutation({
	args: {
		transactions: v.array(v.any()), // You can strictly type this using v.object() if preferred
		sessionId: v.string(),
	},
	handler: async (ctx, args) => {
		// Set expiry for 3 hours from now

		ctx.db.insert('transactions', {
			sessionId: args.sessionId,
			details: args.transactions,
		});
	},
});
