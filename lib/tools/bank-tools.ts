import type { ToolSet } from "ai";
import type { BankState } from "@/types/bank";
import type { BankToolContext } from "./bank-tool-context";
import { buildAnalyzeSpendingTool } from "./analyze-spending";
import { buildGetAccountStatementTool } from "./get-account-statement";
import { buildGetRecentTransactionsTool } from "./get-recent-transactions";
import { buildQueryTransactionsTool } from "./query-transactions";
import { buildRequestMoneyTool } from "./request-money";
import { buildSavingsGoalTool } from "./savings-goal";
import { buildSetCardStatusTool } from "./set-card-status";
import { buildTransferMoneyTool } from "./transfer-money";
import { buildUpdateTransactionLimitTool } from "./update-transaction-limit";
import { buildGetCurrentLimitTool } from "./get-current-limit";

export const BANK_TOOL_NAMES = [
  "get_recent_transactions",
  "analyze_spending",
  "transfer_money",
  "set_card_status",
  "update_transaction_limit",
  "get_current_limit",
  "request_money",
  "get_account_statement",
  "manage_savings_goal",
  "query_transactions",
] as const;

export const buildBankTools = (initialState: BankState) => {
  let state = structuredClone(initialState);
  const context: BankToolContext = {
    getState: () => state,
    setState: (next) => {
      state = next;
    },
  };

  return {
    get_recent_transactions: buildGetRecentTransactionsTool(context),
    analyze_spending: buildAnalyzeSpendingTool(context),
    transfer_money: buildTransferMoneyTool(context),
    set_card_status: buildSetCardStatusTool(context),
    update_transaction_limit: buildUpdateTransactionLimitTool(context),
    get_current_limit: buildGetCurrentLimitTool(context),
    request_money: buildRequestMoneyTool(context),
    get_account_statement: buildGetAccountStatementTool(context),
    manage_savings_goal: buildSavingsGoalTool(context),
    query_transactions: buildQueryTransactionsTool(context),
  } satisfies ToolSet;
};
