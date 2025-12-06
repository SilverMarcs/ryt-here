import * as React from "react";
import { AlertCircle, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AmountDisplay } from "@/components/shared/amount-display";
import { Contact } from "@/types/bank";
import { TransactionLimitControl } from "./transaction-limit";

export interface TransferConfirmationData {
  recipientName: string;
  amount: number;
  note?: string;
  currency?: string;
  contact?: Contact;
  canProceed?: boolean;
  reference: string;
  currentLimit?: number;
  usedToday?: number;
  pendingLimit?: number;
}

export const TransferConfirmation = ({
  data,
  onConfirm,
  onCancel,
  busy,
}: {
  data: TransferConfirmationData;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) => {
  const contactName = data.contact?.name ?? data.recipientName;
  const initials = contactName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="px-2">
          <p className="text-xs uppercase text-muted-foreground">Transfer</p>
          <p className="text-lg font-semibold">{contactName}</p>
          {/*<p className="text-xs text-muted-foreground">Ref {data.reference}</p>*/}
        </div>
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="space-y-4 -mt-4">
        <div className="rounded-2xl bg-muted/60 px-4 py-3">
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-3xl font-semibold">
            <AmountDisplay
              amount={data.amount}
              currency={data.currency}
              emphasize
            />
          </p>
          {data.note ? (
            <p className="mt-2 rounded-lg bg-card/80 px-3 py-2 text-xs">
              Note: {data.note}
            </p>
          ) : null}
        </div>

        {data.canProceed === false ? (
          <div className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-xs">
            <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Cannot proceed</p>
              <p className="text-muted-foreground mt-0.5">
                Recipient not found in saved contacts or insufficient balance.
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            className="flex-1"
            type="button"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={onConfirm}
            disabled={busy || data.canProceed === false}
          >
            Confirm &amp; Pay
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const TransferLimitExceeded = ({
  data,
  onLimitChange,
  onConfirmLimit,
  onCancel,
}: {
  data: TransferConfirmationData & { currentLimit: number; usedToday?: number; pendingLimit?: number };
  onLimitChange: (newLimit: number) => void;
  onConfirmLimit: () => void;
  onCancel: () => void;
}) => {
  const contactName = data.contact?.name ?? data.recipientName;
  const initials = contactName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-3">
               <div className="flex items-start gap-2 rounded-xl bg-orange-500/10 border border-orange-500/30 px-3 py-2.5 text-xs">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-orange-500" />
            <div>
              <p className="font-semibold text-orange-600 dark:text-orange-400">
                Amount exceeds your current limit
              </p>
              <p className="text-muted-foreground mt-0.5">
                Your current daily limit is{" "}
                <AmountDisplay amount={data.currentLimit} currency={data.currency} />.
                Increase it below to proceed.
              </p>
            </div>
          </div>

      <TransactionLimitControl
        currentLimit={data.currentLimit}
        currency={data.currency ?? "RM"}
        usedToday={data.usedToday ?? 0}
        pendingLimit={data.pendingLimit}
        onChange={onLimitChange}
        onConfirm={onConfirmLimit}
        confirmLabel="Change limit"
      />
    </div>
  );
};

export const TransferLimitIncreaseWaiting = ({
  data,
  onComplete,
}: {
  data: TransferConfirmationData & { newLimit: number; currentLimit: number };
  onComplete?: () => void;
}) => {
  return (
    <LimitUpdateSuccess
      previous={data.currentLimit}
      next={data.newLimit}
      currency={data.currency ?? "RM"}
      transferInfo={{
        recipientName: data.contact?.name ?? data.recipientName,
        amount: data.amount,
      }}
      onComplete={onComplete}
    />
  );
};

const LimitUpdateSuccess = ({
  previous,
  next,
  currency,
  transferInfo,
  onComplete,
}: {
  previous: number;
  next: number;
  currency: string;
  transferInfo?: {
    recipientName: string;
    amount: number;
  };
  onComplete?: () => void;
}) => {
  const [countdown, setCountdown] = React.useState(10);

  React.useEffect(() => {
    if (countdown <= 0) {
      // Notify parent that countdown is complete
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onComplete]);

  return (
    <Card className="border-blue-500/30">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-500/10 p-2">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase text-muted-foreground">Limit Updated</p>
            <p className="text-lg font-semibold">Processing</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Previous Limit</span>
            <span className="font-medium">
              <AmountDisplay amount={previous} currency={currency} />
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">New Limit</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              <AmountDisplay amount={next} currency={currency} />
            </span>
          </div>
        </div>

        {/* {transferInfo && (
          <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-xs">
            <p className="font-medium text-foreground mb-1">Pending Transfer</p>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>To {transferInfo.recipientName}</span>
              <span className="font-medium text-foreground">
                <AmountDisplay amount={transferInfo.amount} currency={currency} />
              </span>
            </div>
          </div>
        )} */}

        <div className="rounded-lg bg-orange-500/10 border border-orange-500/30 px-3 py-2.5 text-xs">
          <p className="font-medium text-orange-600 dark:text-orange-400 mb-1">
            {countdown > 0 ? `Processing ${countdown}s` : 'Limit updated!'}
          </p>
          <p className="text-muted-foreground">
            {countdown > 0
              ? 'Please wait while we update your transaction limit.'
              : 'You can now make your transfer.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
