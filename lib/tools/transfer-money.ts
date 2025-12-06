import { tool } from "ai";
import { z } from "zod";
import { findContactByName } from "@/lib/bank";
import type { TransferToolOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";
import { calculateUsedToday } from "./bank-tool-helpers";

export const buildTransferMoneyTool = (ctx: BankToolContext) =>
  tool({
    description:
      "Prepare a transfer to a saved contact. ALWAYS check if the transfer amount exceeds the current transaction limit AND if the user has sufficient balance before proceeding.",
    inputSchema: z.object({
      recipientName: z.string().min(1),
      amount: z.number().positive(),
      note: z.string().optional(),
    }),
    execute: async ({ recipientName, amount, note }) => {
      const state = ctx.getState();
      const contact = findContactByName(state, recipientName);
      const now = new Date();
      const reference = `PENDING-${now.getTime().toString().slice(-6)}`;
      const currentLimit = state.user.card.transactionLimit;
      const usedToday = calculateUsedToday(state);
      
      // Check if user has sufficient balance
      if (amount > state.user.balance) {
        const result: TransferToolOutput = {
          status: "cancelled",
          recipientName,
          amount,
          currency: state.user.currency,
          note,
          contact,
          canProceed: false,
          reference,
        };
        return result;
      }
      
      // Check if amount exceeds current limit
      if (amount > currentLimit) {
        const result: TransferToolOutput = {
          status: "limit_exceeded",
          recipientName,
          amount,
          currency: state.user.currency,
          note,
          contact,
          canProceed: Boolean(contact),
          reference,
          currentLimit,
          usedToday,
          pendingLimit: amount, // Suggest the transfer amount as new limit
        };
        return result;
      }
      
      const result: TransferToolOutput = {
        status: "needs_confirmation",
        recipientName,
        amount,
        currency: state.user.currency,
        note,
        contact,
        canProceed: Boolean(contact),
        reference,
      };
      return result;
    },
  });
