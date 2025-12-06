import { tool } from "ai";
import { z } from "zod";
import { buildSpendingSummary } from "@/lib/bank";
import type { SpendingAnalysisOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";

export const buildAnalyzeSpendingTool = (ctx: BankToolContext) =>
  tool({
    description: "Analyze the user's spending and show a chart.",
    inputSchema: z.object({
      period: z.enum(["week", "month", "year"]).optional().default("month"),
      chartType: z.enum(["pie", "bar"]).optional().default("pie"),
    }),
    execute: async ({ period = "month", chartType = "pie" }) => {
      const summary = buildSpendingSummary(ctx.getState(), period, chartType);
      const result: SpendingAnalysisOutput = {
        ...summary,
        currency: ctx.getState().user.currency,
      };
      return result;
    },
  });
