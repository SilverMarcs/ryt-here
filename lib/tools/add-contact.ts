import { tool } from "ai";
import { z } from "zod";
import { addNewContact } from "@/lib/bank";
import type { AddContactOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";

export const buildAddContactTool = (ctx: BankToolContext) =>
  tool({
    description:
      "Add a new contact to the user's saved contacts using name and email. Shows a confirmation view before adding the contact.",
    inputSchema: z.object({
      name: z.string().min(1, "Contact name is required"),
      email: z.string().email("Valid email is required"),
    }),
    execute: async ({ name, email }) => {
      const state = ctx.getState();

      // Check if contact already exists
      const existingContact = state.contacts.find(
        (contact) => contact.name.toLowerCase() === name.toLowerCase().trim(),
      );

      if (existingContact) {
        const result: AddContactOutput = {
          status: "cancelled",
          contact: existingContact,
          message: `Contact "${name}" already exists.`,
        };
        return result;
      }

      // Create the new contact but don't add to state yet - wait for confirmation
      const { contact } = addNewContact(state, { name, email });

      const result: AddContactOutput = {
        status: "needs_confirmation",
        contact,
      };
      return result;
    },
  });
