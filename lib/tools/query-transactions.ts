import { tool } from "ai";
import { z } from "zod";
import { sortTransactions } from "@/lib/bank";
import type { QueryTransactionsOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";
import type { Transaction } from "@/types/bank";

export const buildQueryTransactionsTool = (ctx: BankToolContext) =>
  tool({
    description: `Query and filter user transactions for intelligent analysis and display.

USE THIS TOOL WHEN the user asks to see or analyze specific types of transactions, such as:
- Subscription analysis: "Show my subscriptions" or "Which subscriptions had a price increase?"
- Category filtering: "Show my food expenses" or "What did I spend on entertainment?"
- Pattern detection: "Show my recurring expenses"
- Historical comparisons: "Show shopping transactions from last month"
- Specific vendor/merchant: "Show all Spotify transactions"

This tool will:
1. Filter transactions based on keywords, categories, and patterns
2. Display them in a nice scrollable list UI
3. Allow the AI to analyze patterns and provide insights

DO NOT use this tool for:
- Simple "show my recent transactions" requests (use get_recent_transactions instead)
- Creating spending charts (use analyze_spending instead)

IMPORTANT: After receiving the filtered transactions, you can provide additional analysis and insights in your text response if helpful.`,
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "A brief description of what transactions to find (e.g., 'subscriptions', 'food expenses', 'Spotify')"
        ),
      monthsBack: z
        .number()
        .min(1)
        .max(12)
        .optional()
        .default(6)
        .describe("How many months of transaction history to include"),
    }),
    execute: async ({ query, monthsBack = 6 }) => {
      const state = ctx.getState();
      const transactions = sortTransactions(state.transactions);

      // Filter transactions within the requested time range
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);

      let filteredTransactions = transactions.filter(
        (txn) => new Date(txn.date) >= cutoffDate
      );

      // Apply smart filtering based on query
      const queryLower = query.toLowerCase();
      
      // Filter by category keywords
      const categoryKeywords: Record<string, string[]> = {
        subscription: ['netflix', 'spotify', 'prime', 'subscription', 'youtube', 'apple music', 'disney+'],
        food: ['restaurant', 'cafe', 'food', 'dining', 'starbucks', 'mcdonald'],
        shopping: ['amazon', 'shop', 'store', 'mall', 'retail'],
        transport: ['uber', 'grab', 'transport', 'taxi', 'parking', 'fuel', 'gas'],
        entertainment: ['cinema', 'movie', 'game', 'entertainment', 'theatre'],
      };
      
      // Check if query matches any category keywords
      let matchedCategory: string | null = null;
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => queryLower.includes(kw))) {
          matchedCategory = category;
          filteredTransactions = filteredTransactions.filter((txn: Transaction) => {
            const desc = txn.description.toLowerCase();
            return keywords.some(kw => desc.includes(kw)) || txn.category === category;
          });
          break;
        }
      }
      
      // If no category match, try to match specific merchant/description
      if (!matchedCategory && queryLower.length > 3) {
        // Extract potential search terms (remove common words)
        const searchTerms = queryLower
          .split(/\s+/)
          .filter(word => !['show', 'my', 'the', 'all', 'from', 'to', 'for', 'in', 'on', 'at'].includes(word));
        
        if (searchTerms.length > 0) {
          filteredTransactions = filteredTransactions.filter((txn: Transaction) => {
            const desc = txn.description.toLowerCase();
            return searchTerms.some(term => desc.includes(term));
          });
        }
      }

      const result: QueryTransactionsOutput = {
        query,
        monthsBack,
        currency: state.user.currency,
        transactions: filteredTransactions,
        totalTransactions: filteredTransactions.length,
        dateRange: {
          from: cutoffDate.toISOString().split("T")[0],
          to: new Date().toISOString().split("T")[0],
        },
      };

      return result;
    },
  });
