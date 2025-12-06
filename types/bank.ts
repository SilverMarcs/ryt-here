export type CardStatus = "active" | "frozen";

export type TransactionType = "credit" | "debit";

export type TransactionCategory =
  | "food"
  | "transport"
  | "utilities"
  | "entertainment"
  | "shopping"
  | "transfer"
  | "income";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  recipient?: string;
}

export interface MoneyRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  recipientName: string;
  amount: number;
  note?: string;
  status: "pending" | "paid" | "declined" | "expired";
  createdAt: string;
  expiresAt: string;
}

export type SavingsGoalStatus = "active" | "completed" | "paused";
export type SavingsGoalIcon = "plane" | "shield" | "home" | "car" | "gift" | "graduation" | "heart" | "piggy";

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt: string;
  status: SavingsGoalStatus;
  icon?: SavingsGoalIcon;
}

export interface UserProfile {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  card: {
    status: CardStatus;
    lastFourDigits: string;
    transactionLimit: number;
  };
}

export interface Contact {
  id: string;
  name: string;
  accountNumber: string;
  bank: string;
}

export interface BankState {
  user: UserProfile;
  transactions: Transaction[];
  contacts: Contact[];
  moneyRequests: MoneyRequest[];
  savingsGoals: SavingsGoal[];
}

export type SpendingPeriod = "week" | "month" | "year";

export type SpendingChartType = "pie" | "bar";
