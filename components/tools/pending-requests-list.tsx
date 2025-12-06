import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AmountDisplay } from "@/components/shared/amount-display";
import { StatusBadge } from "@/components/shared/status-badge";
import type { MoneyRequest } from "@/types/bank";

export const PendingRequestsList = ({
  requests,
  currency = "MYR",
  onCancel,
}: {
  requests: MoneyRequest[];
  currency?: string;
  onCancel?: (id: string) => void;
}) => {
  const pending = requests.filter((req) => req.status === "pending");

  return (
    <Card className="border border-border/70 shadow-md">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Money Requests
          </p>
          <p className="text-lg font-semibold">Pending</p>
        </div>
        <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
          {pending.length} pending
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pending requests right now.
          </p>
        ) : null}
        {pending.map((req) => (
          <div
            key={req.id}
            className="flex flex-col gap-2 rounded-xl border border-border bg-muted/40 p-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">→ {req.recipientName}</p>
                {req.note ? (
                  <p className="text-xs text-muted-foreground">“{req.note}”</p>
                ) : null}
              </div>
              <StatusBadge status="pending" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <AmountDisplay
                amount={req.amount}
                currency={currency}
                emphasize
              />
              {/* <span className="text-xs text-muted-foreground">
                Expires {new Date(req.expiresAt).toLocaleDateString()}
              </span> */}
            </div>
            {onCancel ? (
              <button
                type="button"
                onClick={() => onCancel(req.id)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
              >
                Cancel Request
              </button>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
