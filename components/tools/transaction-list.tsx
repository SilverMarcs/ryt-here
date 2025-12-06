import { ArrowUpRight, ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryIcon } from "@/components/shared/category-icon";
import { AmountDisplay } from "@/components/shared/amount-display";
import { Transaction, TransactionCategory } from "@/types/bank";

interface TransactionListProps {
  title?: string;
  transactions: Transaction[];
  category?: TransactionCategory;
  limit?: number;
  currency?: string;
}

const formatDate = (date: string) => {
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

export const TransactionList = ({
  title = "Recent Transactions",
  transactions,
  category,
  limit,
  currency = "MYR",
}: TransactionListProps) => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Transactions
          </p>
          <p className="text-lg font-semibold">{title}</p>
        </div>
        <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
          {category ? category : `${transactions.length} items`}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 rounded-lg border">
          <ul className="divide-y divide-border p-3">
            {transactions.map((txn) => (
              <li
                key={txn.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <CategoryIcon category={txn.category} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(txn.date)}{" "}
                    {txn.recipient ? `• ${txn.recipient}` : ""}
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
            ))}
          </ul>
        </ScrollArea>
        {/*<div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {transactions.length}
            {limit ? ` of ${limit}` : ""}{" "}
            {category ? `${category} items` : "latest transactions"}
          </span>
          <div className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[11px] font-semibold">
            <ReceiptText className="h-3 w-3" />
            View history
            <ArrowUpRight className="h-3 w-3" />
          </div>
        </div>*/}
      </CardContent>
    </Card>
  );
};
