import { tool } from "ai";
import { z } from "zod";
import { updateTransactionLimit } from "@/lib/bank";
import type { TransactionLimitOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";
import { calculateUsedToday, clampLimit } from "./bank-tool-helpers";

export const buildUpdateTransactionLimitTool = (ctx: BankToolContext) =>
  tool({
    description: "View or update the card transaction limit. If user doesn't specify an amount, call the tools with action `view` to show the interactive slider UI. Don't ask follow-up questions.",
    inputSchema: z.object({
      action: z.enum(["view", "update"]).optional().default("view"),
      newLimit: z.number().positive().optional(),
    }),
    execute: async ({ action = "view", newLimit }) => {
      const usedToday = calculateUsedToday(ctx.getState());
      if (action === "update" && typeof newLimit === "number") {
        const next = clampLimit(newLimit);
        const previous = ctx.getState().user.card.transactionLimit;
        // Don't update state immediately - let the UI handle it with delay
        const result: TransactionLimitOutput = {
          action,
          currentLimit: previous,
          newLimit: next,
          usedToday,
          currency: ctx.getState().user.currency,
        };
        return result;
      }

      const result: TransactionLimitOutput = {
        action: "view",
        currentLimit: ctx.getState().user.card.transactionLimit,
        usedToday,
        currency: ctx.getState().user.currency,
      };
      return result;
    },
  });
