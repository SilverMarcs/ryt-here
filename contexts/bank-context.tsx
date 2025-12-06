"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  BankState,
  CardStatus,
  Contact,
  MoneyRequest,
  SavingsGoal,
  SpendingChartType,
  SpendingPeriod,
  Transaction,
} from "@/types/bank";
import { initialBankState } from "@/lib/mock-data";
import {
  MoneyRequestIntent,
  RecentTransactionParams,
  SpendingSummary,
  TransferIntent,
  contributeToSavingsGoal,
  createMoneyRequest,
  buildSpendingSummary,
  formatCurrency,
  getActiveState,
  getRecentTransactions,
  performTransfer,
  updateCardStatus,
  updateTransactionLimit,
} from "@/lib/bank";

const STORAGE_KEY = "ryt-here-bank-state";

interface BankContextValue {
  state: BankState;
  setState: Dispatch<SetStateAction<BankState>>;
  contacts: Contact[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  userBalance: string;
  getRecent: (params?: RecentTransactionParams) => Transaction[];
  summarizeSpending: (
    period?: SpendingPeriod,
    chartType?: SpendingChartType,
  ) => SpendingSummary;
  setCardStatus: (status: CardStatus) => void;
  setTransactionLimit: (newLimit: number) => void;
  addMoneyRequest: (intent: MoneyRequestIntent) => {
    request: MoneyRequest;
    shareUrl: string;
  };
  executeTransfer: (intent: TransferIntent) => {
    reference: string;
    transaction: Transaction;
    balance: number;
  };
  contributeToGoal: (goalId: string, amount: number) => void;
  refreshFromStorage: () => void;
}

const BankContext = createContext<BankContextValue | null>(null);

export const BankProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<BankState>(initialBankState);

  useEffect(() => {
    const cached =
      typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as BankState;
      // Hydrate from localStorage after mount to avoid flashing stale data.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(getActiveState(parsed));
    } catch {
      // ignore malformed cache
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getRecent = useCallback(
    (params?: RecentTransactionParams) => getRecentTransactions(state, params),
    [state],
  );

  const summarizeSpending = useCallback(
    (period?: SpendingPeriod, chartType?: SpendingChartType) =>
      buildSpendingSummary(state, period, chartType),
    [state],
  );

  const setCardStatus = useCallback(
    (status: CardStatus) => setState((prev) => updateCardStatus(prev, status)),
    [],
  );

  const setTransactionLimit = useCallback(
    (newLimit: number) =>
      setState((prev) => updateTransactionLimit(prev, newLimit)),
    [],
  );

  const addMoneyRequest = useCallback(
    (intent: MoneyRequestIntent) => {
      const { newState, request, shareUrl } = createMoneyRequest(state, intent);
      setState(newState);
      return { request, shareUrl };
    },
    [state],
  );

  const executeTransfer = useCallback(
    (intent: TransferIntent) => {
      const { newState, reference, transaction } = performTransfer(
        state,
        intent,
      );
      setState(newState);
      return { reference, transaction, balance: newState.user.balance };
    },
    [state],
  );

  const contributeToGoal = useCallback(
    (goalId: string, amount: number) => {
      const { newState } = contributeToSavingsGoal(state, goalId, amount);
      setState(newState);
    },
    [state],
  );

  const refreshFromStorage = useCallback(() => {
    const cached =
      typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as BankState;
      setState(getActiveState(parsed));
    } catch {
      setState(getActiveState(initialBankState));
    }
  }, []);

  const value = useMemo<BankContextValue>(
    () => ({
      state,
      setState,
      contacts: state.contacts,
      transactions: state.transactions,
      savingsGoals: state.savingsGoals,
      userBalance: formatCurrency(state.user.balance, state.user.currency),
      getRecent,
      summarizeSpending,
      setCardStatus,
      setTransactionLimit,
      addMoneyRequest,
      executeTransfer,
      contributeToGoal,
      refreshFromStorage,
    }),
    [
      state,
      getRecent,
      summarizeSpending,
      setCardStatus,
      setTransactionLimit,
      addMoneyRequest,
      executeTransfer,
      contributeToGoal,
      refreshFromStorage,
    ],
  );

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error("useBank must be used within BankProvider");
  }
  return context;
};
