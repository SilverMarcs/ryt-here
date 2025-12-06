import * as React from "react";
import { Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from "@/types/bank";

export interface AddContactCardData {
  contact: Contact;
  message?: string;
}

export const AddContactCard = ({
  data,
  onConfirm,
  onCancel,
  busy,
}: {
  data: AddContactCardData;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) => {
  const { contact } = data;
  const initials = contact.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="px-2">
          <p className="text-xs uppercase text-muted-foreground">New Contact</p>
          <p className="text-lg font-semibold">{contact.name}</p>
        </div>
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="space-y-4 -mt-4">
        <div className="rounded-2xl bg-white/10 border border-white/20 px-5 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-white/60" />
            <div className="text-sm">
              <p className="text-xs text-white/60 uppercase tracking-wide">Name</p>
              <p className="text-white font-medium">{contact.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-white/60" />
            <div className="text-sm">
              <p className="text-xs text-white/60 uppercase tracking-wide">Email</p>
              <p className="text-white font-medium break-all">{contact.accountNumber}</p>
            </div>
          </div>
        </div>

        {data.message ? (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 text-xs">
            <p className="text-amber-200">{data.message}</p>
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
            disabled={busy}
          >
            Add Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
