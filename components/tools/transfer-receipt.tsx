import { CheckCircle2, Copy, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AmountDisplay } from "@/components/shared/amount-display";
import { useState } from "react";

export interface TransferReceiptData {
  recipientName: string;
  amount: number;
  currency?: string;
  reference: string;
  newBalance: number;
  note?: string;
  completedAt?: string;
}

export const TransferReceipt = ({ data }: { data: TransferReceiptData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Transfer Receipt
          </p>
          <p className="text-lg font-semibold">{data.recipientName}</p>
          {data.completedAt ? (
            <p className="text-xs text-muted-foreground">{data.completedAt}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Success
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl bg-muted/40 p-3 ">
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-lg font-semibold">
            <AmountDisplay
              amount={data.amount}
              currency={data.currency}
              emphasize
            />
          </p>
          {/* {data.note ? (
            <p className="mt-2 rounded-lg bg-card/90 px-3 py-2 text-xs">
              Note: {data.note}
            </p>
          ) : null} */}
        </div>
        <div className="rounded-xl bg-card px-2 py-3 text-sm mt-2">
          <div className="flex items-center justify-between p-2">
            <span className="text-muted-foreground">Reference</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground"
            >
              <Copy className="h-3 w-3" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="font-mono text-sm">{data.reference}</p>
          <p className="mt-1 text-muted-foreground">
            New balance: <AmountDisplay amount={data.newBalance} emphasize />
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
