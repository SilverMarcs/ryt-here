import type { MoneyRequest } from "@/types/bank";

export const mockMoneyRequests: MoneyRequest[] = [
  {
    id: "req_001",
    requesterId: "usr_001",
    requesterName: "John Doe",
    recipientName: "Sarah",
    amount: 45,
    note: "Dinner share",
    status: "pending",
    createdAt: "2025-12-04T18:30:00Z",
    expiresAt: "2025-12-11T18:30:00Z",
  },
];
