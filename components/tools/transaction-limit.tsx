import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AmountDisplay } from "@/components/shared/amount-display";
import { ProgressBar } from "@/components/shared/progress-bar";
import { useEffect, useState } from "react";

type TransactionLimitControlProps = {
  currentLimit: number;
  currency: string;
  usedToday?: number;
  min?: number;
  max?: number;
  pendingLimit?: number;
  onChange?: (value: number) => void;
  onConfirm?: () => void;
  confirmLabel?: string;
};

const presets = [1000, 5000, 10000];

export const TransactionLimitControl = ({
  currentLimit,
  currency,
  usedToday = 0,
  min = 100,
  max = 50000,
  pendingLimit,
  onChange,
  onConfirm,
  confirmLabel = "Update limit",
}: TransactionLimitControlProps) => {
  const limitToDisplay = pendingLimit ?? currentLimit;
  const usedPercent = Math.min(100, (usedToday / currentLimit) * 100);

  return (
    <Card className="border border-border/70 shadow-md">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Transaction Limit
          </p>
          <p className="text-lg font-semibold">
            {/* <AmountDisplay
              amount={currentLimit}
              currency={currency}
              emphasize
            /> */}
            Daily Spending Cap
          </p>
          {/* <p className="text-xs text-muted-foreground">
            Adjust your daily spending cap instantly.
          </p> */}
        </div>
        <div className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-foreground">
          Daily cap
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4">
          <p className="text-xs text-muted-foreground">Current Daily Limit</p>
          <p className="text-2xl font-semibold">
            <AmountDisplay
              amount={currentLimit}
              currency={currency}
              emphasize
            />
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {currency} {min.toLocaleString()}
            </span>
            <span>
              {currency} {max.toLocaleString()}
            </span>
          </div>
          <Slider
            value={[limitToDisplay]}
            min={min}
            max={max}
            step={100}
            onValueChange={(values) => onChange?.(values[0])}
            className="py-2"
          />
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              <AmountDisplay amount={limitToDisplay} currency={currency} />
            </p>
            <p className="text-xs text-muted-foreground">New daily limit</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {presets.map((value) => (
            <Button
              key={value}
              variant="outline"
              size="sm"
              onClick={() => onChange?.(value)}
              className="rounded-full"
            >
              <AmountDisplay amount={value} currency={currency} />
            </Button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Used today</span>
            <span>
              <AmountDisplay amount={usedToday} currency={currency} /> /{" "}
              <AmountDisplay amount={currentLimit} currency={currency} />
            </span>
          </div>
          <ProgressBar value={usedPercent} max={100} className="mt-1" />
        </div>

        {onConfirm ? (
          <Button
            className="w-full"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
};

export const LimitUpdateSuccess = ({
  previous,
  next,
  currency,
  onClose,
}: {
  previous: number;
  next: number;
  currency: string;
  onClose?: () => void;
}) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <Card className="border border-border/70 shadow-md">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Transaction Limit
          </p>
          <p className="text-lg font-semibold">Limit Updated</p>
        </div>
        <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
          New <AmountDisplay amount={next} currency={currency} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-dashed border-border bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Previous Limit</span>
            <AmountDisplay amount={previous} currency={currency} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">New Limit</span>
            <AmountDisplay amount={next} currency={currency} emphasize />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {countdown > 0 ? `Updating in ${countdown} second${countdown === 1 ? '' : 's'}...` : 'Limit updated!'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
