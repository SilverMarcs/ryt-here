"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  PiggyBank,
  TrendingUp,
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
}

const quickActions: QuickAction[] = [
  {
    id: "view-transactions",
    label: "Recent Transactions",
    description: "View your latest transactions",
    icon: <TrendingUp className="h-5 w-5" />,
    prompt: "Show me my recent transactions",
  },
  {
    id: "spending-analysis",
    label: "Spending Analysis",
    description: "Analyze your spending patterns",
    icon: <ArrowDownLeft className="h-5 w-5" />,
    prompt: "Analyze my spending for this month",
  },
  {
    id: "transfer-money",
    label: "Transfer Money",
    description: "Send money to Sarah",
    icon: <ArrowUpRight className="h-5 w-5" />,
    prompt: "Transfer MYR 100 to Sarah",
  },
  {
    id: "card-status",
    label: "Card Status",
    description: "Check or change card status",
    icon: <CreditCard className="h-5 w-5" />,
    prompt: "What is my card status?",
  },
  {
    id: "savings-goal",
    label: "Savings Goals",
    description: "View or manage savings goals",
    icon: <PiggyBank className="h-5 w-5" />,
    prompt: "Show me my savings goals",
  },
];

interface QuickActionsPopupProps {
  onClose: () => void;
  onSelectAction: (prompt: string) => void;
  buttonRef?: React.RefObject<HTMLElement>;
}

export const QuickActionsPopup = ({
  onClose,
  onSelectAction,
}: QuickActionsPopupProps) => {
  return (
    <>
      {/* Invisible backdrop for closing */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Popup positioned above the button */}
      <div className="absolute bottom-full left-0 mb-2 w-80 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
        <div className="rounded-xl border border-border bg-popover shadow-xl backdrop-blur-none">
          {/* Header */}
          <div className="border-b border-border bg-popover px-4 py-3">
            <h3 className="text-sm font-semibold text-popover-foreground">
              Quick Actions
            </h3>
          </div>

          {/* Actions List */}
          <div className="max-h-[400px] overflow-y-auto p-2 bg-popover">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  onSelectAction(action.prompt);
                  onClose();
                }}
                className="group flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all hover:bg-muted active:scale-[0.98]"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    {action.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
