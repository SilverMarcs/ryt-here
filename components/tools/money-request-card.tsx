import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AmountDisplay } from "@/components/shared/amount-display";
import { QRCodeDisplay } from "@/components/shared/qr-code-display";
import { StatusBadge } from "@/components/shared/status-badge";
import type { MoneyRequest } from "@/types/bank";
import { Button } from "../ui/button";

export const MoneyRequestCard = ({
  request,
  shareUrl,
  qrData = "qr-placeholder",
  onCopy,
  onShare,
}: {
  request: MoneyRequest;
  shareUrl: string;
  qrData?: string;
  onCopy?: () => void;
  onShare?: () => void;
}) => {
  const created = new Date(request.createdAt).toLocaleString();
  const expires = new Date(request.expiresAt).toLocaleDateString();

  return (
    <Card className="border border-border/70 shadow-md">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Money Request
          </p>
          <p className="text-lg font-semibold">To {request.recipientName}</p>
          <p className="text-xs text-muted-foreground">Created {created}</p>
        </div>
        <StatusBadge status={request.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4">
          <p className="text-xs text-white/60 mb-1">Requesting from</p>
          <p className="text-lg font-semibold text-white mb-3">{request.recipientName}</p>
          <div className="bg-white/10 rounded-lg px-3 py-2 border border-white/20">
            <p className="text-xs text-white/60 mb-1">Amount</p>
            <p className="text-2xl font-bold text-white">
              <AmountDisplay amount={request.amount} emphasize />
            </p>
          </div>
          {request.note ? (
            <p className="text-sm text-white/70 mt-3">
              Note: "{request.note}"
            </p>
          ) : null}
        </div>

        <QRCodeDisplay
          data={qrData}
          caption={`Scan to pay ${request.amount.toFixed(2)}`}
        />

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Share this link</p>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <span className="truncate font-semibold text-foreground">
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={onCopy}
              className="shrink-0 rounded-lg border border-border px-2 py-1 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              Copy
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Expires: {expires}</span>
            <button
              type="button"
              onClick={onShare}
              className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              Share
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MoneyRequestConfirmation = ({
  request,
  onConfirm,
  onCancel,
}: {
  request: MoneyRequest;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const created = new Date(request.createdAt).toLocaleString();
  const expires = new Date(request.expiresAt).toLocaleDateString();

  return (
    <Card className="border border-border/70 shadow-md">
      <CardHeader className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Money Request
          </p>
          <p className="text-lg font-semibold">
            Requesting {request.recipientName}
          </p>
        </div>
        <div className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold text-white">
          <AmountDisplay amount={request.amount} emphasize />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {request.note ? (
          <p className="font-medium text-md -mt-20">Note: “{request.note}”</p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button onClick={onConfirm}>Confirm request</Button>
          <Button variant={"secondary"} onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
