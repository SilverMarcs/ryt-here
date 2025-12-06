import { tool } from "ai";
import { z } from "zod";
import { createMoneyRequest } from "@/lib/bank";
import type { MoneyRequestOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";

export const buildRequestMoneyTool = (ctx: BankToolContext) =>
  tool({
    description: "Create a money request and generate a share link/QR.",
    inputSchema: z.object({
      recipientName: z.string().min(1),
      amount: z.number().positive(),
      note: z.string().optional(),
      expiryDays: z.number().int().positive().optional(),
    }),
    execute: async ({ recipientName, amount, note, expiryDays }) => {
      const { request, shareUrl } = createMoneyRequest(ctx.getState(), {
        recipientName,
        amount,
        note,
        expiryDays,
      });

      const result: MoneyRequestOutput = {
        status: "needs_confirmation",
        request,
        shareUrl,
        qrData: shareUrl,
      };
      return result;
    },
  });
