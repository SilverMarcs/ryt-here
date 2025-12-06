import { tool } from "ai";
import { z } from "zod";
import { buildStatement, sortTransactions } from "@/lib/bank";
import type { AccountStatementOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";
import { resolveDateRange } from "./bank-tool-helpers";

export const buildGetAccountStatementTool = (ctx: BankToolContext) =>
  tool({
    description:
      "Generate an account statement for a specified period. Shows opening/closing balance, total credits/debits, and all transactions within the date range.",
    inputSchema: z.object({
      duration: z
        .enum(["7days", "30days", "90days", "custom"])
        .optional()
        .default("30days"),
      startDate: z
        .string()
        .optional()
        .describe("Start date in YYYY-MM-DD format (for custom duration)"),
      endDate: z
        .string()
        .optional()
        .describe("End date in YYYY-MM-DD format (for custom duration)"),
    }),
    execute: async ({ duration = "30days", startDate, endDate }) => {
      const state = ctx.getState();
      const { start, end, label } = resolveDateRange(
        duration,
        startDate,
        endDate,
      );

      const statement = buildStatement(state, start, end);

      // Filter transactions within the date range
      const startTs = new Date(start).getTime();
      const endTs = new Date(end).getTime();
      const filtered = state.transactions.filter((txn) => {
        const txnTs = new Date(txn.date).getTime();
        return txnTs >= startTs && txnTs <= endTs;
      });

      const result: AccountStatementOutput = {
        startDate: start,
        endDate: end,
        periodLabel: label,
        openingBalance: statement.openingBalance,
        closingBalance: statement.closingBalance,
        totalCredits: statement.totalCredits,
        totalDebits: statement.totalDebits,
        transactions: sortTransactions(filtered),
        currency: state.user.currency,
        accountNumber: state.user.accountNumber,
        accountHolder: state.user.name,
      };

      return result;
    },
  });
