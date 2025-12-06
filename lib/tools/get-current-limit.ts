import { tool } from "ai";
import { z } from "zod";
import type { TransactionLimitOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";
import { calculateUsedToday } from "./bank-tool-helpers";

export const buildGetCurrentLimitTool = (ctx: BankToolContext) =>
  tool({
    description: "Get the current transaction limit without showing the UI. Use this when you need to know the current limit to answer a question.",
    inputSchema: z.object({}),
    execute: async () => {
      const usedToday = calculateUsedToday(ctx.getState());
      const result: TransactionLimitOutput = {
        action: "view",
        currentLimit: ctx.getState().user.card.transactionLimit,
        usedToday,
        currency: ctx.getState().user.currency,
      };
      return result;
    },
  });
