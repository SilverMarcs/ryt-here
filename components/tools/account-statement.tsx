"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Download,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/shared/category-icon";
import { AmountDisplay } from "@/components/shared/amount-display";
import { Transaction } from "@/types/bank";

interface AccountStatementProps {
  startDate: string;
  endDate: string;
  periodLabel: string;
  openingBalance: number;
  closingBalance: number;
  totalCredits: number;
  totalDebits: number;
  transactions: Transaction[];
  currency?: string;
  accountNumber: string;
  accountHolder: string;
}

const formatDateDisplay = (date: string) => {
  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatTransactionDate = (date: string) => {
  const parsed = new Date(date);
  const today = new Date();
  if (parsed.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (parsed.toDateString() === yesterday.toDateString()) return "Yesterday";
  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
  }).format(parsed);
};

export const AccountStatement = ({
  startDate,
  endDate,
  periodLabel,
  openingBalance,
  closingBalance,
  totalCredits,
  totalDebits,
  transactions,
  currency = "MYR",
  accountNumber,
  accountHolder,
}: AccountStatementProps) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const visibleTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 5);
  const hasMore = transactions.length > 5;
  const netChange = totalCredits - totalDebits;

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Account Statement
            </p>
            <p className="text-lg font-semibold">{accountHolder}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {periodLabel}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {accountNumber}
          </div>
        </div>

        {/* Period Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Opening Balance</p>
            <p className="text-base font-semibold">
              <AmountDisplay amount={openingBalance} currency={currency} />
            </p>
            <p className="text-[10px] text-muted-foreground">
              {formatDateDisplay(startDate)}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Closing Balance</p>
            <p className="text-base font-semibold">
              <AmountDisplay amount={closingBalance} currency={currency} />
            </p>
            <p className="text-[10px] text-muted-foreground">
              {formatDateDisplay(endDate)}
            </p>
          </div>
        </div>

        {/* Credits & Debits Summary */}
        <div className="flex items-center justify-between rounded-xl bg-card border p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Money In</p>
              <p className="text-sm font-semibold text-emerald-600">
                +<AmountDisplay amount={totalCredits} currency={currency} />
              </p>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-500">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Money Out</p>
              <p className="text-sm font-semibold text-rose-500">
                -<AmountDisplay amount={totalDebits} currency={currency} />
              </p>
            </div>
          </div>
        </div>

        {/* Net Change */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-xs text-muted-foreground">Net Change</span>
          <span
            className={`text-sm font-semibold ${netChange >= 0 ? "text-emerald-600" : "text-rose-500"}`}
          >
            {netChange >= 0 ? "+" : ""}
            <AmountDisplay amount={netChange} currency={currency} />
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Transactions List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Transactions ({transactions.length})
            </p>
          </div>

          <ScrollArea className="h-72 rounded-lg border">
            <ul className="divide-y divide-border p-3">
              {visibleTransactions.length === 0 ? (
                <li className="py-6 text-center text-sm text-muted-foreground">
                  No transactions in this period
                </li>
              ) : (
                visibleTransactions.map((txn) => (
                  <li
                    key={txn.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <CategoryIcon category={txn.category} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {txn.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTransactionDate(txn.date)}
                        {txn.recipient ? ` • ${txn.recipient}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <AmountDisplay
                        amount={txn.type === "debit" ? -txn.amount : txn.amount}
                        currency={currency}
                        emphasize
                      />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </ScrollArea>

          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => setShowAllTransactions(!showAllTransactions)}
            >
              {showAllTransactions
                ? "Show less"
                : `Show all ${transactions.length} transactions`}
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              // PDF download placeholder
            }}
          >
            <Download className="h-3 w-3" />
            Download PDF
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Statement generated {new Date().toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
