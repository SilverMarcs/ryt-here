import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import type { CardStatus } from "@/types/bank";
import { Button } from "../ui/button";

export const CardStatusChange = ({
  status,
  lastFourDigits,
  cardholderName,
  expiryDate = "12/28",
  reason,
  onToggle,
}: {
  status: CardStatus;
  lastFourDigits: string;
  cardholderName: string;
  expiryDate?: string;
  reason?: string;
  onToggle?: () => void;
}) => {
  const isFrozen = status === "frozen";
  const headline = isFrozen ? "Card Frozen" : "Card Activated";
  const actionLabel = isFrozen ? "Unfreeze Card" : "Freeze Card";

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Card Controls
          </p>
          <p className="text-lg font-semibold">{headline}</p>
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 p-4 text-white shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide">MyBank</span>
            <CreditCard className="h-6 w-6 opacity-80" />
          </div>
          <div className="mb-4 font-mono text-lg tracking-[0.2em]">
            •••• •••• •••• {lastFourDigits}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-300">
                Card Holder
              </p>
              <p className="text-sm font-semibold uppercase tracking-wide">
                {cardholderName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-slate-300">
                Expires
              </p>
              <p className="text-sm font-semibold">{expiryDate}</p>
            </div>
          </div>
          {isFrozen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
              <span className="rounded-full bg-red-500/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
                Frozen
              </span>
            </div>
          )}
        </div>

        {/* {reason ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Reason noted: {reason}
          </div>
        ) : null} */}

        <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <p>
            {isFrozen
              ? "All transactions are blocked until you reactivate your card."
              : "Your card is active. Freeze instantly if you suspect fraud."}
          </p>
          {/* <p className="font-semibold text-foreground">
            If this wasn&apos;t you, contact us at 1-800-88-1234.
          </p> */}
        </div>

        {onToggle ? (
          <Button
          className="w-full"
            type="button"
            onClick={onToggle}
          >
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};
