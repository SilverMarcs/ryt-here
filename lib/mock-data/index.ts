import type { BankState } from "@/types/bank";
import { mockUser } from "./user";
import { mockTransactions } from "./transactions";
import { mockContacts } from "./contacts";
import { mockMoneyRequests } from "./money-requests";
import { mockSavingsGoals } from "./savings-goals";

export const initialBankState: BankState = {
  user: mockUser,
  transactions: mockTransactions,
  contacts: mockContacts,
  moneyRequests: mockMoneyRequests,
  savingsGoals: mockSavingsGoals,
};

// Re-export individual mock data for direct access if needed
export { mockUser, mockTransactions, mockContacts, mockMoneyRequests, mockSavingsGoals };
