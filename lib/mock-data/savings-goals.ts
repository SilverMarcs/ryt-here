import type { SavingsGoal } from "@/types/bank";

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: "goal_001",
    name: "Japan Trip",
    targetAmount: 8000,
    currentAmount: 3200,
    deadline: "2026-04-01",
    createdAt: "2025-06-01",
    status: "active",
    icon: "plane",
  },
  {
    id: "goal_002",
    name: "Emergency Fund",
    targetAmount: 15000,
    currentAmount: 7500,
    createdAt: "2025-01-15",
    status: "active",
    icon: "shield",
  },
];
