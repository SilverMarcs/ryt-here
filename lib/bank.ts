import { initialBankState } from "@/lib/mock-data";
import type {
  BankState,
  CardStatus,
  Contact,
  MoneyRequest,
  SavingsGoal,
  SavingsGoalIcon,
  SpendingChartType,
  SpendingPeriod,
  Transaction,
  TransactionCategory,
} from "@/types/bank";

export interface RecentTransactionParams {
  limit?: number;
  category?: TransactionCategory;
}

export interface SpendingSummary {
  period: SpendingPeriod;
  chartType: SpendingChartType;
  totals: { category: TransactionCategory; amount: number }[];
  totalSpent: number;
  periodLabel: string;
  topCategory?: TransactionCategory;
  insight?: string;
}

export interface TransferIntent {
  recipientName: string;
  amount: number;
  note?: string;
}

export interface TransferOutcome {
  newState: BankState;
  reference: string;
  transaction: Transaction;
}

export const getActiveState = (state?: BankState | null): BankState => {
  const base = structuredClone(initialBankState);
  if (!state) return base;

  return {
    ...base,
    ...state,
    user: {
      ...base.user,
      ...state.user,
      card: { ...base.user.card, ...state.user?.card },
    },
    transactions: state.transactions ?? base.transactions,
    contacts: state.contacts ?? base.contacts,
    moneyRequests: state.moneyRequests ?? base.moneyRequests,
    savingsGoals: state.savingsGoals ?? base.savingsGoals,
  };
};

export const findContactByName = (
  state: BankState,
  name: string,
): Contact | undefined =>
  state.contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase().trim(),
  );

export const sortTransactions = (transactions: Transaction[]) =>
  [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

export const getRecentTransactions = (
  state: BankState,
  { limit = 5, category }: RecentTransactionParams = {},
) => {
  const filtered = category
    ? state.transactions.filter((txn) => txn.category === category)
    : state.transactions;

  return sortTransactions(filtered).slice(0, limit);
};

const getAnchorDate = (transactions: Transaction[]) => {
  if (!transactions.length) return new Date();
  const newest = sortTransactions(transactions)[0];
  return new Date(newest.date);
};

const getPeriodStart = (
  anchor: Date,
  period: SpendingPeriod,
): { start: Date; label: string } => {
  const start = new Date(anchor);
  if (period === "week") {
    start.setDate(anchor.getDate() - 6);
    return { start, label: "This Week" };
  }
  if (period === "month") {
    start.setMonth(anchor.getMonth(), 1);
    return {
      start,
      label: anchor.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    };
  }
  start.setFullYear(anchor.getFullYear(), 0, 1);
  return { start, label: anchor.getFullYear().toString() };
};

export const buildSpendingSummary = (
  state: BankState,
  period: SpendingPeriod = "month",
  chartType: SpendingChartType = "pie",
): SpendingSummary => {
  const anchorDate = getAnchorDate(state.transactions);
  const { start, label } = getPeriodStart(anchorDate, period);

  const totals = state.transactions.reduce<Record<TransactionCategory, number>>(
    (acc, txn) => {
      if (txn.type !== "debit") return acc;
      const txnDate = new Date(txn.date);
      if (txnDate < start) return acc;
      acc[txn.category] = (acc[txn.category] ?? 0) + txn.amount;
      return acc;
    },
    {} as Record<TransactionCategory, number>,
  );

  const chartData = Object.entries(totals).map(([category, amount]) => ({
    category: category as TransactionCategory,
    amount,
  }));

  const totalSpent = chartData.reduce((sum, item) => sum + item.amount, 0);
  const topCategory = chartData
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .at(0)?.category;

  return {
    period,
    chartType,
    totals: chartData,
    totalSpent,
    topCategory,
    periodLabel: label,
    insight: topCategory
      ? `Your biggest outlay is ${topCategory}.`
      : "No spending recorded for this period.",
  };
};

export const formatCurrency = (amount: number, currency = "MYR") =>
  new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

export const nextTransactionId = (transactions: Transaction[]) => {
  const maxId = transactions.reduce((max, txn) => {
    const numeric = Number(txn.id.replace(/\D/g, ""));
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 0);
  const next = (maxId + 1).toString().padStart(3, "0");
  return `txn_${next}`;
};

export const nextMoneyRequestId = (moneyRequests: MoneyRequest[]) => {
  const maxId = moneyRequests.reduce((max, req) => {
    const numeric = Number(req.id.replace(/\D/g, ""));
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 0);
  const next = (maxId + 1).toString().padStart(3, "0");
  return `req_${next}`;
};

export const performTransfer = (
  state: BankState,
  { recipientName, amount, note }: TransferIntent,
): TransferOutcome => {
  const contact = findContactByName(state, recipientName);
  
  // Validate sufficient balance
  if (amount > state.user.balance) {
    throw new Error(`Insufficient balance. Available: ${formatCurrency(state.user.balance, state.user.currency)}, Required: ${formatCurrency(amount, state.user.currency)}`);
  }
  
  const now = new Date();
  const reference = `TXN-${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
    .getTime()
    .toString()
    .slice(-5)}`;

  const transaction: Transaction = {
    id: nextTransactionId(state.transactions),
    date: now.toISOString().slice(0, 10),
    description: `Transfer to ${contact?.name ?? recipientName}${
      note ? ` • ${note}` : ""
    }`,
    amount,
    type: "debit",
    category: "transfer",
    recipient: contact?.name ?? recipientName,
  };

  const newBalance = state.user.balance - amount;
  const newState: BankState = {
    ...state,
    user: { ...state.user, balance: newBalance },
    transactions: [transaction, ...state.transactions],
  };

  return { newState, reference, transaction };
};

export const summarizeIncomeExpenses = (
  transactions: Transaction[],
  startDate?: string,
  endDate?: string,
) => {
  const start = startDate ? new Date(startDate) : undefined;
  const end = endDate ? new Date(endDate) : undefined;

  return transactions.reduce(
    (acc, txn) => {
      const txnDate = new Date(txn.date);
      if (start && txnDate < start) return acc;
      if (end && txnDate > end) return acc;

      if (txn.type === "credit") {
        acc.income += txn.amount;
      } else {
        acc.expenses += txn.amount;
      }

      return acc;
    },
    { income: 0, expenses: 0 },
  );
};

export interface StatementSummary {
  startDate: string;
  endDate: string;
  openingBalance: number;
  totalCredits: number;
  totalDebits: number;
  closingBalance: number;
}

export const buildStatement = (
  state: BankState,
  startDate: string,
  endDate: string,
): StatementSummary => {
  const { income, expenses } = summarizeIncomeExpenses(
    state.transactions,
    startDate,
    endDate,
  );
  const closingBalance = state.user.balance;
  const netChange = income - expenses;
  const openingBalance = closingBalance - netChange;

  return {
    startDate,
    endDate,
    openingBalance,
    totalCredits: income,
    totalDebits: expenses,
    closingBalance,
  };
};

export const updateCardStatus = (state: BankState, status: CardStatus) => ({
  ...state,
  user: { ...state.user, card: { ...state.user.card, status } },
});

export const updateTransactionLimit = (state: BankState, newLimit: number) => ({
  ...state,
  user: {
    ...state.user,
    card: { ...state.user.card, transactionLimit: newLimit },
  },
});

export interface MoneyRequestIntent {
  recipientName: string;
  amount: number;
  note?: string;
  expiryDays?: number;
}

export const createMoneyRequest = (
  state: BankState,
  { recipientName, amount, note, expiryDays = 7 }: MoneyRequestIntent,
): { newState: BankState; request: MoneyRequest; shareUrl: string } => {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(now.getDate() + expiryDays);

  const request: MoneyRequest = {
    id: nextMoneyRequestId(state.moneyRequests),
    requesterId: state.user.id,
    requesterName: state.user.name,
    recipientName,
    amount,
    note,
    status: "pending",
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const shareUrl = `https://ryt-here.com/pay/${request.id}`;

  return {
    newState: {
      ...state,
      moneyRequests: [request, ...state.moneyRequests],
    },
    request,
    shareUrl,
  };
};

export const buildAccountOverview = (
  state: BankState,
  startDate?: string,
  endDate?: string,
) => {
  const anchorEnd = endDate ?? new Date().toISOString().slice(0, 10);
  const anchorStart =
    startDate ??
    (() => {
      const now = new Date(anchorEnd);
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return firstOfMonth.toISOString().slice(0, 10);
    })();

  const incomeExpense = summarizeIncomeExpenses(
    state.transactions,
    anchorStart,
    anchorEnd,
  );
  const statement = buildStatement(state, anchorStart, anchorEnd);

  return {
    ...incomeExpense,
    statement,
  };
};

// ============ SAVINGS GOALS ============

export const nextSavingsGoalId = (goals: SavingsGoal[]) => {
  const maxId = goals.reduce((max, goal) => {
    const numeric = Number(goal.id.replace(/\D/g, ""));
    return Number.isNaN(numeric) ? max : Math.max(max, numeric);
  }, 0);
  const next = (maxId + 1).toString().padStart(3, "0");
  return `goal_${next}`;
};

export interface CreateSavingsGoalIntent {
  name: string;
  targetAmount: number;
  deadline?: string;
  icon?: SavingsGoalIcon;
}

export const createSavingsGoal = (
  state: BankState,
  { name, targetAmount, deadline, icon }: CreateSavingsGoalIntent,
): { newState: BankState; goal: SavingsGoal } => {
  const goal: SavingsGoal = {
    id: nextSavingsGoalId(state.savingsGoals),
    name,
    targetAmount,
    currentAmount: 0,
    deadline,
    createdAt: new Date().toISOString().slice(0, 10),
    status: "active",
    icon: icon ?? "piggy",
  };

  return {
    newState: {
      ...state,
      savingsGoals: [goal, ...state.savingsGoals],
    },
    goal,
  };
};

export const updateSavingsGoal = (
  state: BankState,
  goalId: string,
  updates: Partial<Pick<SavingsGoal, "name" | "targetAmount" | "deadline" | "status" | "icon">>,
): { newState: BankState; goal: SavingsGoal | undefined } => {
  const goalIndex = state.savingsGoals.findIndex((g) => g.id === goalId);
  if (goalIndex === -1) {
    return { newState: state, goal: undefined };
  }

  const updatedGoal: SavingsGoal = {
    ...state.savingsGoals[goalIndex],
    ...updates,
  };

  const newGoals = [...state.savingsGoals];
  newGoals[goalIndex] = updatedGoal;

  return {
    newState: { ...state, savingsGoals: newGoals },
    goal: updatedGoal,
  };
};

export const contributeToSavingsGoal = (
  state: BankState,
  goalId: string,
  amount: number,
): { newState: BankState; goal: SavingsGoal | undefined; previousAmount: number } => {
  const goalIndex = state.savingsGoals.findIndex((g) => g.id === goalId);
  if (goalIndex === -1) {
    return { newState: state, goal: undefined, previousAmount: 0 };
  }

  const previousAmount = state.savingsGoals[goalIndex].currentAmount;
  const newAmount = previousAmount + amount;
  
  const updatedGoal: SavingsGoal = {
    ...state.savingsGoals[goalIndex],
    currentAmount: newAmount,
    status: newAmount >= state.savingsGoals[goalIndex].targetAmount ? "completed" : "active",
  };

  const newGoals = [...state.savingsGoals];
  newGoals[goalIndex] = updatedGoal;

  return {
    newState: { ...state, savingsGoals: newGoals },
    goal: updatedGoal,
    previousAmount,
  };
};

export const findSavingsGoalByName = (
  state: BankState,
  name: string,
): SavingsGoal | undefined =>
  state.savingsGoals.find(
    (goal) => goal.name.toLowerCase().includes(name.toLowerCase().trim()),
  );

export const getSavingsGoalProgress = (goal: SavingsGoal) => {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  return { progress, remaining };
};
