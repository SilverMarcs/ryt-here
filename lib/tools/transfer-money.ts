import { tool } from "ai";
import { z } from "zod";
import { findContactByName } from "@/lib/bank";
import type { TransferToolOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";

export const buildTransferMoneyTool = (ctx: BankToolContext) =>
  tool({
    description:
      "Prepare a transfer to a saved contact. Always request confirmation before finalizing.",
    inputSchema: z.object({
      recipientName: z.string().min(1),
      amount: z.number().positive(),
      note: z.string().optional(),
    }),
    execute: async ({ recipientName, amount, note }) => {
      const contact = findContactByName(ctx.getState(), recipientName);
      const now = new Date();
      const reference = `PENDING-${now.getTime().toString().slice(-6)}`;
      const result: TransferToolOutput = {
        status: "needs_confirmation",
        recipientName,
        amount,
        currency: ctx.getState().user.currency,
        note,
        contact,
        canProceed: Boolean(contact),
        reference,
      };
      return result;
    },
  });
