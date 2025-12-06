import { cn } from "@/lib/utils";

const variants: Record<
  string,
  { bg: string; text: string; dot: string; label?: string }
> = {
  active: {
    bg: "bg-emerald-500/20 text-emerald-400",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    label: "Active",
  },
  frozen: {
    bg: "bg-slate-500/20 text-slate-300",
    text: "text-slate-300",
    dot: "bg-slate-400",
    label: "Frozen",
  },
  pending: {
    bg: "bg-amber-500/20 text-amber-400",
    text: "text-amber-400",
    dot: "bg-amber-400",
    label: "Pending",
  },
  paid: {
    bg: "bg-emerald-500/20 text-emerald-400",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
    label: "Paid",
  },
  unpaid: {
    bg: "bg-rose-500/20 text-rose-400",
    text: "text-rose-400",
    dot: "bg-rose-400",
    label: "Unpaid",
  },
  info: {
    bg: "bg-blue-500/20 text-blue-400",
    text: "text-blue-400",
    dot: "bg-blue-400",
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
