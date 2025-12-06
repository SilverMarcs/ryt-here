import {
  CardStatus,
  Contact,
  MoneyRequest,
  SavingsGoal,
  SpendingChartType,
  SpendingPeriod,
  Transaction,
  TransactionCategory,
} from "@/types/bank";

export type TransactionListOutput = {
  title: string;
  limit: number;
  category?: TransactionCategory;
  currency: string;
  transactions: Transaction[];
};

export type SpendingAnalysisOutput = {
  period: SpendingPeriod;
  chartType: SpendingChartType;
  periodLabel: string;
  totals: { category: TransactionCategory; amount: number }[];
  totalSpent: number;
  topCategory?: TransactionCategory;
  insight?: string;
  currency: string;
};

export type TransferToolStatus =
  | "needs_confirmation"
  | "completed"
  | "cancelled";

export type TransferToolOutput = {
  status: TransferToolStatus;
  recipientName: string;
  amount: number;
  currency: string;
  note?: string;
  contact?: Contact;
  canProceed?: boolean;
  reference: string;
  newBalance?: number;
  transactionId?: string;
  completedAt?: string;
};

export type CardStatusChangeOutput = {
  status: CardStatus;
  reason?: string;
  supportNumber?: string;
};

export type TransactionLimitOutput = {
  action: "view" | "update";
  currentLimit: number;
  newLimit?: number;
  usedToday?: number;
  currency: string;
};

export type MoneyRequestStatus =
  | "needs_confirmation"
  | "confirmed"
  | "cancelled";

export type MoneyRequestOutput = {
  status: MoneyRequestStatus;
  request: MoneyRequest;
  shareUrl: string;
  qrData?: string;
};

export type AccountStatementOutput = {
  startDate: string;
  endDate: string;
  periodLabel: string;
  openingBalance: number;
  closingBalance: number;
  totalCredits: number;
  totalDebits: number;
  transactions: Transaction[];
  currency: string;
  accountNumber: string;
  accountHolder: string;
};

// Savings Goal Tool Output Types
export type SavingsGoalAction = "view" | "create" | "update" | "contribute";

export type SavingsGoalOutput = {
  action: SavingsGoalAction;
  goal?: SavingsGoal;
  goals?: SavingsGoal[];
  currency: string;
  message?: string;
  contributionAmount?: number;
  previousAmount?: number;
};

// Query Transactions Tool Output - for intelligent transaction analysis
export type QueryTransactionsOutput = {
  query: string;
  monthsBack: number;
  currency: string;
  transactions: Transaction[];
  totalTransactions: number;
  dateRange: {
    from: string;
    to: string;
  };
};
