import { cn } from "@/lib/utils";

const variants: Record<
  string,
  { bg: string; text: string; dot: string; label?: string }
> = {
  active: {
    bg: "bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Active",
  },
  frozen: {
    bg: "bg-slate-100 text-slate-700",
    text: "text-slate-700",
    dot: "bg-slate-500",
    label: "Frozen",
  },
  pending: {
    bg: "bg-amber-50 text-amber-700",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Pending",
  },
  paid: {
    bg: "bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Paid",
  },
  unpaid: {
    bg: "bg-rose-50 text-rose-700",
    text: "text-rose-700",
    dot: "bg-rose-500",
    label: "Unpaid",
  },
  info: {
    bg: "bg-blue-50 text-blue-700",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
};

export const StatusBadge = ({
  status,
  label,
  className,
}: {
  status: keyof typeof variants | string;
  label?: string;
  className?: string;
}) => {
  const variant = variants[status] ?? variants.info;
  const display = label ?? variant.label ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        variant.bg,
        className,
      )}
    >
      <span className={cn("h-2.5 w-2.5 rounded-full", variant.dot)} />
      <span className={variant.text}>{display}</span>
    </span>
  );
};
