import type { BankState } from "@/types/bank";

export type BankToolContext = {
  getState: () => BankState;
  setState: (state: BankState) => void;
};
