import type { BankState } from "@/types/bank";

export const clampLimit = (value: number, min = 100, max = 50000) =>
  Math.min(max, Math.max(min, Math.round(value)));

export const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export const resolveDateRange = (
  duration: "7days" | "30days" | "90days" | "custom",
  startDate?: string,
  endDate?: string,
) => {
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date(end);

  if (duration === "7days") start.setDate(end.getDate() - 6);
  if (duration === "30days") start.setDate(end.getDate() - 29);
  if (duration === "90days") start.setDate(end.getDate() - 89);

  if (start > end) {
    const temp = new Date(start);
    start.setTime(end.getTime());
    end.setTime(temp.getTime());
  }

  const label = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  return { start: formatDate(start), end: formatDate(end), label };
};

export const calculateUsedToday = (state: BankState) => {
  const today = formatDate(new Date());
  return state.transactions
    .filter((txn) => txn.date === today && txn.type === "debit")
    .reduce((sum, txn) => sum + txn.amount, 0);
};
