import type { UIMessage, UITools, UIDataTypes } from "ai";
import {
  AccountStatementOutput,
  CardStatusChangeOutput,
  MoneyRequestOutput,
  SavingsGoalOutput,
  SpendingAnalysisOutput,
  TransactionListOutput,
  TransferToolOutput,
  TransactionLimitOutput,
} from "@/types/chat";
import type { SpendingPeriod, TransactionCategory } from "@/types/bank";

export type BankTools = {
  get_recent_transactions: {
    input: { limit?: number; category?: TransactionCategory };
    output: TransactionListOutput;
  };
  analyze_spending: {
    input: { period?: SpendingPeriod; chartType?: "pie" | "bar" };
    output: SpendingAnalysisOutput;
  };
  transfer_money: {
    input: { recipientName: string; amount: number; note?: string };
    output: TransferToolOutput;
  };
  set_card_status: {
    input: { status: "frozen" | "active"; reason?: string };
    output: CardStatusChangeOutput;
  };
  update_transaction_limit: {
    input: { action?: "view" | "update"; newLimit?: number };
    output: TransactionLimitOutput;
  };
  get_current_limit: {
    input: {};
    output: TransactionLimitOutput;
  };
  request_money: {
    input: {
      recipientName: string;
      amount: number;
      note?: string;
      expiryDays?: number;
    };
    output: MoneyRequestOutput;
  };
  get_account_statement: {
    input: {
      duration?: "7days" | "30days" | "90days" | "custom";
      startDate?: string;
      endDate?: string;
    };
    output: AccountStatementOutput;
  };
  manage_savings_goal: {
    input: {
      action: "view" | "create" | "update" | "contribute";
      goalName?: string;
      targetAmount?: number;
      contributionAmount?: number;
      deadline?: string;
      icon?: string;
    };
    output: SavingsGoalOutput;
  };
} & UITools;

export type BankUIMessage = UIMessage<never, UIDataTypes, BankTools>;
