import { tool } from "ai";
import { z } from "zod";
import { getRecentTransactions } from "@/lib/bank";
import type { TransactionListOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";

export const buildGetRecentTransactionsTool = (ctx: BankToolContext) =>
  tool({
    description: "Show the user's most recent transactions.",
    inputSchema: z.object({
      limit: z.number().min(1).max(20).optional().default(5),
      category: z
        .enum([
          "food",
          "transport",
          "utilities",
          "entertainment",
          "shopping",
          "transfer",
          "income",
        ])
        .optional(),
    }),
    execute: async ({ limit = 5, category }) => {
      const transactions = getRecentTransactions(ctx.getState(), {
        limit,
        category,
      });
      const result: TransactionListOutput = {
        title: "Recent Transactions",
        limit,
        category,
        currency: ctx.getState().user.currency,
        transactions,
      };
      return result;
    },
  });
