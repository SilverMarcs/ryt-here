import type { UserProfile } from "@/types/bank";

export const mockUser: UserProfile = {
  id: "usr_001",
  name: "Ali Bin Ahmad",
  accountNumber: "1234-5678-9012",
  balance: 25420.5,
  currency: "MYR",
  card: {
    status: "active",
    lastFourDigits: "4829",
    transactionLimit: 5000,
    defaultTransactionLimit: 5000,
  },
};
