import { tool } from "ai";
import { z } from "zod";
import {
  createSavingsGoal,
  updateSavingsGoal,
  contributeToSavingsGoal,
  findSavingsGoalByName,
  getSavingsGoalProgress,
} from "@/lib/bank";
import type { SavingsGoalOutput } from "@/types/chat";
import type { BankToolContext } from "./bank-tool-context";

export const buildSavingsGoalTool = (ctx: BankToolContext) =>
  tool({
    description: `Manage savings goals. Use this when user wants to:
- View their savings goals ("Show my savings goals", "How close am I to my goal?")
- Create a new goal ("Set a savings goal of RM 5000 for travel", "Create emergency fund goal")
- Update a goal ("Update my travel goal to RM 3000", "Change deadline for Japan trip")
- Add money to a goal ("Add RM 500 to my travel fund", "Contribute to emergency fund")`,
    inputSchema: z.object({
      action: z
        .enum(["view", "create", "update", "contribute"])
        .describe("The action to perform"),
      goalName: z
        .string()
        .optional()
        .describe("Name of the goal (for create, update, contribute, or viewing specific goal)"),
      targetAmount: z
        .number()
        .optional()
        .describe("Target amount for the goal (for create or update)"),
      contributionAmount: z
        .number()
        .optional()
        .describe("Amount to contribute to the goal"),
      deadline: z
        .string()
        .optional()
        .describe("Deadline for the goal in YYYY-MM-DD format"),
      icon: z
        .enum(["plane", "shield", "home", "car", "gift", "graduation", "heart", "piggy"])
        .optional()
        .describe("Icon for the goal"),
    }),
    execute: async ({
      action,
      goalName,
      targetAmount,
      contributionAmount,
      deadline,
      icon,
    }): Promise<SavingsGoalOutput> => {
      const state = ctx.getState();
      const currency = state.user.currency;

      switch (action) {
        case "view": {
          if (goalName) {
            const goal = findSavingsGoalByName(state, goalName);
            if (!goal) {
              return {
                action: "view",
                goals: state.savingsGoals,
                currency,
                message: `No goal found matching "${goalName}". Here are your current goals.`,
              };
            }
            return {
              action: "view",
              goal,
              currency,
            };
          }
          return {
            action: "view",
            goals: state.savingsGoals,
            currency,
          };
        }

        case "create": {
          if (!goalName || !targetAmount) {
            return {
              action: "create",
              goals: state.savingsGoals,
              currency,
              message: "Please provide both a name and target amount for the goal.",
            };
          }

          const { newState, goal } = createSavingsGoal(state, {
            name: goalName,
            targetAmount,
            deadline,
            icon,
          });

          ctx.setState(newState);

          return {
            action: "create",
            goal,
            goals: newState.savingsGoals,
            currency,
            message: `Created new savings goal "${goalName}" with target ${currency} ${targetAmount.toLocaleString()}.`,
          };
        }

        case "update": {
          if (!goalName) {
            return {
              action: "update",
              goals: state.savingsGoals,
              currency,
              message: "Please specify which goal to update.",
            };
          }

          const existingGoal = findSavingsGoalByName(state, goalName);
          if (!existingGoal) {
            return {
              action: "update",
              goals: state.savingsGoals,
              currency,
              message: `No goal found matching "${goalName}".`,
            };
          }

          const updates: Parameters<typeof updateSavingsGoal>[2] = {};
          if (targetAmount !== undefined) updates.targetAmount = targetAmount;
          if (deadline !== undefined) updates.deadline = deadline;
          if (icon !== undefined) updates.icon = icon;

          const { newState, goal } = updateSavingsGoal(state, existingGoal.id, updates);
          ctx.setState(newState);

          return {
            action: "update",
            goal,
            goals: newState.savingsGoals,
            currency,
            message: `Updated "${goal?.name}" goal.`,
          };
        }

        case "contribute": {
          if (!goalName) {
            return {
              action: "contribute",
              goals: state.savingsGoals,
              currency,
              message: "Please specify which goal to contribute to.",
            };
          }

          const targetGoal = findSavingsGoalByName(state, goalName);
          if (!targetGoal) {
            return {
              action: "contribute",
              goals: state.savingsGoals,
              currency,
              message: `No goal found matching "${goalName}".`,
            };
          }

          if (!contributionAmount || contributionAmount <= 0) {
            return {
              action: "contribute",
              goal: targetGoal,
              currency,
              message: "Please specify an amount to contribute.",
            };
          }

          const { newState, goal, previousAmount } = contributeToSavingsGoal(
            state,
            targetGoal.id,
            contributionAmount,
          );

          ctx.setState(newState);

          const { progress } = getSavingsGoalProgress(goal!);
          const isCompleted = goal?.status === "completed";

          return {
            action: "contribute",
            goal,
            goals: newState.savingsGoals,
            currency,
            contributionAmount,
            previousAmount,
            message: isCompleted
              ? `🎉 Congratulations! You've reached your "${goal?.name}" goal!`
              : `Added ${currency} ${contributionAmount.toLocaleString()} to "${goal?.name}". Now at ${progress.toFixed(0)}% of target.`,
          };
        }

        default:
          return {
            action: "view",
            goals: state.savingsGoals,
            currency,
          };
      }
    },
  });
