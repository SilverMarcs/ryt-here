import { tool } from "ai";
import { z } from "zod";
import { updateCardStatus } from "@/lib/bank";
import type { CardStatusChangeOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";

export const buildSetCardStatusTool = (ctx: BankToolContext) =>
  tool({
    description: "Freeze or unfreeze the user's card with an optional reason.",
    inputSchema: z.object({
      status: z.enum(["frozen", "active"]),
      reason: z.string().optional(),
    }),
    execute: async ({ status, reason }) => {
      ctx.setState(updateCardStatus(ctx.getState(), status));
      const result: CardStatusChangeOutput = {
        status,
        reason,
        supportNumber: "1-800-88-1234",
      };
      return result;
    },
  });
