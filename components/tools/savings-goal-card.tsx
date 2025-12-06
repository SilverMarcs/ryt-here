"use client";

import { useState } from "react";
import {
  Plane,
  Shield,
  Home,
  Car,
  Gift,
  GraduationCap,
  Heart,
  PiggyBank,
  Target,
  Calendar,
  TrendingUp,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ProgressBar } from "@/components/shared/progress-bar";
import { AmountDisplay } from "@/components/shared/amount-display";
import { SavingsGoal, SavingsGoalIcon } from "@/types/bank";

interface SavingsGoalCardProps {
  goal?: SavingsGoal;
  goals?: SavingsGoal[];
  currency?: string;
  message?: string;
  action: "view" | "create" | "update" | "contribute";
  contributionAmount?: number;
  previousAmount?: number;
  onContribute?: (goalId: string, amount: number) => void;
}

const iconMap: Record<SavingsGoalIcon, React.ElementType> = {
  plane: Plane,
  shield: Shield,
  home: Home,
  car: Car,
  gift: Gift,
  graduation: GraduationCap,
  heart: Heart,
  piggy: PiggyBank,
};

const GoalIcon = ({ icon, className }: { icon?: SavingsGoalIcon; className?: string }) => {
  const Icon = icon ? iconMap[icon] : PiggyBank;
  return <Icon className={className} />;
};

const getTimeRemaining = (deadline: string) => {
  const now = new Date();
  const target = new Date(deadline);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return "Deadline passed";

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days} days left`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} left`;
};

const SingleGoalCard = ({
  goal,
  currency = "MYR",
  isHighlighted = false,
  showContribute = false,
  onContribute,
}: {
  goal: SavingsGoal;
  currency?: string;
  isHighlighted?: boolean;
  showContribute?: boolean;
  onContribute?: (goalId: string, amount: number) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(showContribute);
  const [contributeAmount, setContributeAmount] = useState(100);
  const [currentAmount, setCurrentAmount] = useState(goal.currentAmount);
  
  const progress = Math.min((currentAmount / goal.targetAmount) * 100, 100);
  const remaining = Math.max(goal.targetAmount - currentAmount, 0);
  const isCompleted = currentAmount >= goal.targetAmount;

  const handleContribute = (goalId: string, amount: number) => {
    setCurrentAmount((prev) => prev + amount);
    onContribute?.(goalId, amount);
    setIsExpanded(false);
    setContributeAmount(100);
  };

  return (
    <div
      className={`rounded-xl border p-4 space-y-3 transition-all ${
        isHighlighted ? "ring-2 ring-primary/50 bg-primary/5" : "bg-white/5"
      } ${isCompleted ? "bg-emerald-500/10 border-emerald-500/30" : "border-white/20"}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isCompleted
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {isCompleted ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <GoalIcon icon={goal.icon} className="h-5 w-5" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{goal.name}</p>
            {goal.deadline && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {getTimeRemaining(goal.deadline)}
              </p>
            )}
          </div>
        </div>
        {isCompleted && (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
            Completed!
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <ProgressBar progress={progress} variant={isCompleted ? "success" : "default"} showPercent={false} />
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            <AmountDisplay amount={currentAmount} currency={currency} /> saved
          </span>
          <span className="font-medium">
            <AmountDisplay amount={goal.targetAmount} currency={currency} /> goal
          </span>
        </div>
      </div>

      {/* Remaining */}
      {!isCompleted && (
        <div className="flex items-center justify-between text-xs bg-white/5 rounded-lg px-3 py-2">
          <span className="text-white/60">Remaining</span>
          <span className="font-semibold text-white">
            <AmountDisplay amount={remaining} currency={currency} />
          </span>
        </div>
      )}

      {/* Contribute Section */}
      {!isCompleted && onContribute && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add to goal
            {isExpanded ? (
              <ChevronUp className="h-3 w-3 ml-1" />
            ) : (
              <ChevronDown className="h-3 w-3 ml-1" />
            )}
          </Button>

          {isExpanded && (
            <div className="space-y-3 pt-2 border-t">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Amount</span>
                  <span className="text-sm font-medium">
                    RM {contributeAmount.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[contributeAmount]}
                  onValueChange={([value]) => setContributeAmount(value)}
                  min={10}
                  max={Math.min(remaining, 5000)}
                  step={10}
                  className="w-full"
                />
                <div className="flex gap-2">
                  {[50, 100, 200, 500].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs h-7"
                      onClick={() => setContributeAmount(Math.min(amount, remaining))}
                    >
                      +{amount}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleContribute(goal.id, contributeAmount)}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Add RM {contributeAmount.toLocaleString()}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const SavingsGoalCard = ({
  goal,
  goals,
  currency = "MYR",
  message,
  action,
  contributionAmount,
  previousAmount,
  onContribute,
}: SavingsGoalCardProps) => {
  const [showAll, setShowAll] = useState(false);

  // Single goal view (for specific goal queries or after contribution)
// Single goal view (for specific goal queries or after contribution)
if (goal && !goals) {
  const isCompleted = goal.status === "completed";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            {/* Small label */}
            <p className="text-xs uppercase text-muted-foreground font-medium">
              Savings Goal
            </p>
            {/* Big subtitle – goal name */}
            <p className="text-lg font-semibold">
              {goal.name}
            </p>
          </div>

          {/* Badge on the right */}
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium
              ${isCompleted
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-blue-500/20 text-blue-400"
              }`}
          >
            {isCompleted ? (
              <>
                <Sparkles className="h-3 w-3" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <PiggyBank className="h-3 w-3" />
                <span>Active</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
        <SingleGoalCard
          goal={goal}
          currency={currency}
          isHighlighted={action === "contribute"}
          showContribute={action === "view"}
          onContribute={onContribute}
        />
        {action === "contribute" &&
          contributionAmount &&
          previousAmount !== undefined && (
            <div className="mt-3 text-xs text-center text-muted-foreground">
              +RM {contributionAmount.toLocaleString()} added •{" "}
              RM {previousAmount.toLocaleString()} → RM{" "}
              {goal.currentAmount.toLocaleString()}
            </div>
          )}
      </CardContent>
    </Card>
  );
}

  // Multiple goals view
  const displayGoals = goals ?? [];
  const activeGoals = displayGoals.filter((g) => g.status === "active");
  const completedGoals = displayGoals.filter((g) => g.status === "completed");
  const visibleGoals = showAll ? displayGoals : displayGoals.slice(0, 2);

  const totalSaved = displayGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = displayGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Savings Goals</p>
            <p className="text-lg font-semibold">
              {activeGoals.length} Active Goal{activeGoals.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
            <PiggyBank className="h-3 w-3" />
            {completedGoals.length} completed
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-white/60">Total Saved</p>
            <p className="text-base font-semibold text-emerald-400">
              <AmountDisplay amount={totalSaved} currency={currency} />
            </p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-white/60">Total Target</p>
            <p className="text-base font-semibold text-white">
              <AmountDisplay amount={totalTarget} currency={currency} />
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}

        {/* Goals List */}
        <div className="space-y-3">
          {visibleGoals.map((g) => (
            <SingleGoalCard
              key={g.id}
              goal={g}
              currency={currency}
              isHighlighted={goal?.id === g.id}
              showContribute={action === "view"}
              onContribute={onContribute}
            />
          ))}
        </div>

        {displayGoals.length > 2 && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : `Show all ${displayGoals.length} goals`}
          </Button>
        )}

        {displayGoals.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <PiggyBank className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No savings goals yet</p>
            <p className="text-xs mt-1">Ask me to create one!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
