import { tool } from "ai";
import { z } from "zod";
import { sortTransactions } from "@/lib/bank";
import type { QueryTransactionsOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";

export const buildQueryTransactionsTool = (ctx: BankToolContext) =>
  tool({
    description: `Query all user transactions for intelligent analysis and insights.

USE THIS TOOL WHEN the user asks questions that require analyzing their full transaction history, such as:
- Spending predictions: "How much will I likely spend next month?"
- Subscription analysis: "Which subscriptions had a price increase?"
- Pattern detection: "What are my recurring expenses?"
- Historical comparisons: "Am I spending more on food this month vs last month?"
- Trend identification: "What's my spending trend over the past 3 months?"
- Anomaly detection: "Any unusual transactions recently?"
- Category insights: "What percentage of my income goes to entertainment?"

DO NOT use this tool for:
- Simple "show my recent transactions" requests (use get_recent_transactions instead)
- Specific spending analysis with charts (use analyze_spending instead)

IMPORTANT: After receiving the transactions from this tool, you MUST analyze them and provide a thoughtful response to the user's question. The tool provides raw data - your job is to interpret it and answer their question with specific numbers and insights.`,
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "A brief description of what the user is trying to understand from their transactions"
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

      const filteredTransactions = transactions.filter(
        (txn) => new Date(txn.date) >= cutoffDate
      );

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
