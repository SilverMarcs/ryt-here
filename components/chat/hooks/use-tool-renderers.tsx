"use client";

import {
  useCallback,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import ReactMarkdown from "react-markdown";
import {
  LimitUpdateSuccess,
  TransactionLimitControl,
} from "@/components/tools/transaction-limit";
import { TransferReceipt } from "@/components/tools/transfer-receipt";
import { TransferConfirmation } from "@/components/tools/transfer-confirmation";
import { TransactionList } from "@/components/tools/transaction-list";
import { SpendingChart } from "@/components/tools/spending-chart";
import { CardStatusChange } from "@/components/tools/card-status-change";
import {
  MoneyRequestCard,
  MoneyRequestConfirmation,
} from "@/components/tools/money-request-card";
import { PendingRequestsList } from "@/components/tools/pending-requests-list";
import { AccountStatement } from "@/components/tools/account-statement";
import { SavingsGoalCard } from "@/components/tools/savings-goal-card";
import { BankUIMessage } from "@/types/ui";
import {
  AccountStatementOutput,
  CardStatusChangeOutput,
  MoneyRequestOutput,
  QueryTransactionsOutput,
  SavingsGoalOutput,
  SpendingAnalysisOutput,
  TransactionLimitOutput,
  TransactionListOutput,
  TransferToolOutput,
} from "@/types/chat";
import { BankState, Transaction } from "@/types/bank";
import type { TransferIntent } from "@/lib/bank";

type PendingLimitState = Record<string, number | undefined>;
type BankMessagePart = BankUIMessage["parts"][number];
type RenderResult = ReactNode;

// Helper to check if a part has output ready
const isOutputReady = (part: unknown) => {
  const p = part as { state?: string; output?: unknown };
  return p.state === "output-available" && Boolean(p.output);
};

// Helper type for tool parts with common properties
interface ToolPartWithOutput {
  toolCallId: string;
  output?: unknown;
}

interface ToolRendererOptions {
  state: BankState;
  executeTransfer: (intent: TransferIntent) => {
    reference: string;
    transaction: Transaction;
    balance: number;
  };
  addToolOutput: (params: {
    tool: string;
    toolCallId: string;
    output: unknown;
  }) => Promise<void>;
  pendingLimits: PendingLimitState;
  setPendingLimits: Dispatch<SetStateAction<PendingLimitState>>;
  setCardStatus: (status: BankState["user"]["card"]["status"]) => void;
  setTransactionLimit: (newLimit: number) => void;
  contributeToGoal?: (goalId: string, amount: number) => void;
}

export const useToolRenderers = ({
  state,
  executeTransfer,
  addToolOutput,
  pendingLimits,
  setPendingLimits,
  setCardStatus,
  setTransactionLimit,
  contributeToGoal,
}: ToolRendererOptions) => {
  const renderTransfer = useCallback(
    (part: ToolPartWithOutput) => {
      if (!isOutputReady(part) || !part.output) {
        return (
          <div className="text-xs text-muted-foreground">
            Preparing transfer details…
          </div>
        );
      }

      const output = part.output as TransferToolOutput;

      if (output.status === "needs_confirmation") {
        return (
          <TransferConfirmation
            data={{
              recipientName: output.recipientName,
              amount: output.amount,
              note: output.note,
              currency: output.currency,
              contact: output.contact,
              canProceed: output.canProceed,
              reference: output.reference,
            }}
            onConfirm={async () => {
              const { reference, transaction, balance } = executeTransfer({
                recipientName: output.recipientName,
                amount: output.amount,
                note: output.note,
              });

              await addToolOutput({
                tool: "transfer_money",
                toolCallId: part.toolCallId,
                output: {
                  ...output,
                  status: "completed",
                  reference,
                  transactionId: transaction.id,
                  newBalance: balance,
                  completedAt: new Date().toLocaleString(),
                },
              });
            }}
            onCancel={async () => {
              await addToolOutput({
                tool: "transfer_money",
                toolCallId: part.toolCallId,
                output: { ...output, status: "cancelled" },
              });
            }}
          />
        );
      }

      if (output.status === "completed") {
        return (
          <TransferReceipt
            data={{
              recipientName: output.recipientName,
              amount: output.amount,
              currency: output.currency,
              reference: output.reference,
              newBalance: output.newBalance ?? state.user.balance,
              note: output.note,
              completedAt: output.completedAt,
            }}
          />
        );
      }

      return (
        <div className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
          Transfer cancelled.
        </div>
      );
    },
    [addToolOutput, executeTransfer, state.user.balance],
  );

  const renderTransactionList = useCallback(
    (part: ToolPartWithOutput) => {
      if (!isOutputReady(part) || !part.output) {
        return (
          <div className="text-xs text-muted-foreground">
            Fetching transactions…
          </div>
        );
      }
      const output = part.output as TransactionListOutput;
      return (
        <TransactionList
          title={output.title}
          limit={output.limit}
          category={output.category}
          transactions={output.transactions}
          currency={output.currency}
        />
      );
    },
    [],
  );

  const renderSpending = useCallback(
    (part: ToolPartWithOutput) => {
      if (!isOutputReady(part) || !part.output) {
        return (
          <div className="text-xs text-muted-foreground">
            Crunching numbers…
          </div>
        );
      }
      const output = part.output as SpendingAnalysisOutput;
      return (
        <SpendingChart
          periodLabel={output.periodLabel}
          totals={output.totals}
          totalSpent={output.totalSpent}
          chartType={output.chartType}
          insight={output.insight}
          currency={output.currency}
        />
      );
    },
    [],
  );

  const renderCardStatus = useCallback(
    (part: ToolPartWithOutput) => {
      if (!isOutputReady(part) || !part.output) {
        return (
          <div className="text-xs text-muted-foreground">
            Updating card status…
          </div>
        );
      }
      const output = part.output as CardStatusChangeOutput;
      const newStatus = output.status === "frozen" ? "active" : "frozen";
      return (
        <CardStatusChange
          status={output.status}
          lastFourDigits={state.user.card.lastFourDigits}
          cardholderName={state.user.name}
          reason={output.reason}
          onToggle={async () => {
            setCardStatus(newStatus);
            await addToolOutput({
              tool: "set_card_status",
              toolCallId: part.toolCallId,
              output: {
                ...output,
                status: newStatus,
              },
            });
          }}
        />
      );
    },
    [
      addToolOutput,
      setCardStatus,
      state.user.card.lastFourDigits,
      state.user.name,
    ],
  );

  const renderTransactionLimitCard = useCallback(
    (part: ToolPartWithOutput) => {
      if (!isOutputReady(part) || !part.output) {
        return (
          <div className="text-xs text-muted-foreground">Retrieving limit…</div>
        );
      }
      const output = part.output as TransactionLimitOutput;
      const pendingLimit =
        pendingLimits[part.toolCallId] ??
        output.newLimit ??
        output.currentLimit;
      if (output.action === "update" && output.newLimit !== undefined) {
        return (
          <LimitUpdateSuccess
            previous={output.currentLimit}
            next={output.newLimit}
            currency={output.currency}
            onClose={() => {
              setPendingLimits((prev) => {
                const nextPending = { ...prev };
                delete nextPending[part.toolCallId];
                return nextPending;
              });
              setTransactionLimit(output.newLimit ?? output.currentLimit);
            }}
          />
        );
      }
      return (
        <TransactionLimitControl
          currentLimit={output.currentLimit}
          currency={output.currency}
          usedToday={output.usedToday}
          pendingLimit={pendingLimit}
          onChange={(value) =>
            setPendingLimits((prev) => ({
              ...prev,
              [part.toolCallId]: value,
            }))
          }
          onConfirm={async () => {
            await addToolOutput({
              tool: "update_transaction_limit",
              toolCallId: part.toolCallId,
              output: {
                action: "update",
                currentLimit: output.currentLimit,
                newLimit: pendingLimit,
                usedToday: output.usedToday,
                currency: output.currency,
              },
            });
          }}
          confirmLabel="Confirm new daily limit"
        />
      );
    },
    [addToolOutput, pendingLimits, setPendingLimits, setTransactionLimit],
  );

  const renderMoneyRequest = useCallback(
    (part: ToolPartWithOutput) => {
      if (!isOutputReady(part) || !part.output) {
        return (
          <div className="text-xs text-muted-foreground">Creating request…</div>
        );
      }
      const output = part.output as MoneyRequestOutput;

      if (output.status === "needs_confirmation") {
        return (
          <MoneyRequestConfirmation
            request={output.request}
            onConfirm={async () => {
              await addToolOutput({
                tool: "request_money",
                toolCallId: part.toolCallId,
                output: { ...output, status: "confirmed" },
              });
            }}
            onCancel={async () => {
              await addToolOutput({
                tool: "request_money",
                toolCallId: part.toolCallId,
                output: { ...output, status: "cancelled" },
              });
            }}
          />
        );
      }

      const pendingRequests = (
        <PendingRequestsList
          requests={state.moneyRequests}
          currency={state.user.currency}
        />
      );

      if (output.status === "cancelled") {
        return (
          <div className="space-y-3">
            <div className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
              Money request cancelled.
            </div>
            {pendingRequests}
          </div>
        );
      }

      return (
        <div className="space-y-3">
          {/* <MoneyRequestCard
            request={output.request}
            shareUrl={output.shareUrl}
            qrData={output.qrData}
            onCopy={handleCopy}
            onShare={handleCopy}
          /> */}
          {pendingRequests}
        </div>
      );
    },
    [addToolOutput, state.moneyRequests, state.user.currency],
  );

  const renderAccountStatement = useCallback(
    (part: ToolPartWithOutput) => {
      if (!isOutputReady(part) || !part.output) {
        return (
          <div className="text-xs text-muted-foreground">
            Generating statement…
          </div>
        );
      }
      const output = part.output as AccountStatementOutput;
      return (
        <AccountStatement
          startDate={output.startDate}
          endDate={output.endDate}
          periodLabel={output.periodLabel}
          openingBalance={output.openingBalance}
          closingBalance={output.closingBalance}
          totalCredits={output.totalCredits}
          totalDebits={output.totalDebits}
          transactions={output.transactions}
          currency={output.currency}
          accountNumber={output.accountNumber}
          accountHolder={output.accountHolder}
        />
      );
    },
    [],
  );

  const renderSavingsGoal = useCallback(
    (part: ToolPartWithOutput) => {
      if (!isOutputReady(part) || !part.output) {
        return (
          <div className="text-xs text-muted-foreground">
            Loading savings goals…
          </div>
        );
      }
      const output = part.output as SavingsGoalOutput;
      return (
        <SavingsGoalCard
          goal={output.goal}
          goals={output.goals}
          currency={output.currency}
          message={output.message}
          action={output.action}
          contributionAmount={output.contributionAmount}
          previousAmount={output.previousAmount}
          onContribute={contributeToGoal}
        />
      );
    },
    [contributeToGoal],
  );

  const renderQueryTransactions = useCallback(
    (part: ToolPartWithOutput) => {
      if (!isOutputReady(part) || !part.output) {
        return (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <div className="h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Analyzing your transactions…
          </div>
        );
      }
      const output = part.output as QueryTransactionsOutput;
      // Show a minimal indicator that data was retrieved - the assistant's response will follow
      return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-1.5 px-3 bg-muted/50 rounded-lg w-fit">
          <svg
            className="h-3.5 w-3.5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Reviewed {output.totalTransactions} transactions
            {output.dateRange && ` from ${output.dateRange.from} to ${output.dateRange.to}`}
          </span>
        </div>
      );
    },
    [],
  );

  const isRenderablePart = useCallback(
    (
      part: BankMessagePart,
      hasVisualToolContent: boolean,
      role: "user" | "assistant",
    ) => {
      if (part.type === "text") {
        // Show text if it has content
        // Only hide text for assistant messages with VISUAL tool content (not internal analysis)
        return Boolean((part.text ?? "").trim()) && !(role === "assistant" && hasVisualToolContent);
      }
      return true;
    },
    [],
  );

  const renderPart = useCallback(
    (
      part: BankMessagePart,
      messageId: string,
      role: "user" | "assistant",
    ): RenderResult => {
      if (part.type === "text") {
        if (!(part.text ?? "").trim()) return null;
        if (role === "assistant") {
          return (
            <ReactMarkdown
              key={`${messageId}-${part.type}-${(part.text ?? "").slice(0, 8)}`}
              className="whitespace-pre-wrap"
            >
              {part.text ?? ""}
            </ReactMarkdown>
          );
        }
        return (
          <p
            key={`${messageId}-${part.type}-${(part.text ?? "").slice(0, 8)}`}
            className="leading-relaxed"
          >
            {part.text}
          </p>
        );
      }
      if (part.type === "tool-get_recent_transactions") {
        return <div key={part.toolCallId}>{renderTransactionList(part)}</div>;
      }
      if (part.type === "tool-analyze_spending") {
        return <div key={part.toolCallId}>{renderSpending(part)}</div>;
      }
      if (part.type === "tool-transfer_money") {
        return <div key={part.toolCallId}>{renderTransfer(part)}</div>;
      }
      if (part.type === "tool-set_card_status") {
        return <div key={part.toolCallId}>{renderCardStatus(part)}</div>;
      }
      if (part.type === "tool-update_transaction_limit") {
        return (
          <div key={part.toolCallId}>{renderTransactionLimitCard(part)}</div>
        );
      }
      if (part.type === "tool-request_money") {
        return <div key={part.toolCallId}>{renderMoneyRequest(part)}</div>;
      }
      if (part.type === "tool-get_account_statement") {
        return <div key={part.toolCallId}>{renderAccountStatement(part)}</div>;
      }
      if (part.type === "tool-manage_savings_goal") {
        return <div key={part.toolCallId}>{renderSavingsGoal(part)}</div>;
      }
      if (part.type === "tool-query_transactions") {
        return <div key={part.toolCallId}>{renderQueryTransactions(part)}</div>;
      }
      return null;
    },
    [
      renderAccountStatement,
      renderCardStatus,
      renderMoneyRequest,
      renderQueryTransactions,
      renderSavingsGoal,
      renderSpending,
      renderTransactionLimitCard,
      renderTransactionList,
      renderTransfer,
    ],
  );

  const getVisiblePartsForMessage = useCallback(
    (message: BankUIMessage) => {
      const role = message.role as "user" | "assistant";
      
      // Check for visual tool content (tools that show UI cards)
      const visualTools = [
        "tool-get_recent_transactions",
        "tool-analyze_spending",
        "tool-transfer_money",
        "tool-set_card_status",
        "tool-update_transaction_limit",
        "tool-request_money",
        "tool-get_account_statement",
        "tool-manage_savings_goal",
      ];
      
      const hasVisualToolContent =
        role === "assistant" &&
        message.parts.some(
          (part: BankMessagePart) =>
            typeof part.type === "string" && visualTools.includes(part.type),
        );

      // Check if there's any text content (for typing indicator logic)
      const hasTextContent = message.parts.some(
        (part: BankMessagePart) =>
          part.type === "text" && Boolean((part.text ?? "").trim()),
      );

      // Check if the message only has query_transactions tool (which expects text follow-up)
      const hasQueryTransactionsTool = message.parts.some(
        (part: BankMessagePart) => part.type === "tool-query_transactions",
      );
      const isAwaitingAnalysis =
        role === "assistant" && hasQueryTransactionsTool && !hasTextContent;

      const visibleParts = message.parts
        .filter((part: BankMessagePart) => isRenderablePart(part, hasVisualToolContent, role))
        .map((part: BankMessagePart) => renderPart(part, message.id, role))
        .filter(Boolean);

      return { hasToolContent: hasVisualToolContent, visibleParts, hasTextContent, isAwaitingAnalysis };
    },
    [isRenderablePart, renderPart],
  );

  return { getVisiblePartsForMessage };
};
