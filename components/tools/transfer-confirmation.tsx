import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AmountDisplay } from "@/components/shared/amount-display";
import { Contact } from "@/types/bank";

export interface TransferConfirmationData {
  recipientName: string;
  amount: number;
  note?: string;
  currency?: string;
  contact?: Contact;
  canProceed?: boolean;
  reference: string;
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
          <div className="flex items-start gap-2 rounded-xl bg-muted px-3 py-2 text-xs">
            <AlertCircle className="mt-0.5 h-4 w-4" />
            Recipient not found in saved contacts.
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
