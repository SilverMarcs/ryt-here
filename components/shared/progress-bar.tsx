import { cn } from "@/lib/utils";

type ProgressBarVariant = "default" | "success" | "warning" | "danger";

const variantStyles: Record<ProgressBarVariant, string> = {
  default: "bg-linear-to-r from-blue-500 via-indigo-500 to-sky-400",
  success: "bg-linear-to-r from-emerald-500 via-green-500 to-teal-400",
  warning: "bg-linear-to-r from-amber-500 via-orange-500 to-yellow-400",
  danger: "bg-linear-to-r from-rose-500 via-red-500 to-pink-400",
};

export const ProgressBar = ({
  value,
  progress,
  max = 100,
  label,
  variant = "default",
  showPercent = true,
  className,
}: {
  value?: number;
  progress?: number;
  max?: number;
  label?: string;
  variant?: ProgressBarVariant;
  showPercent?: boolean;
  className?: string;
}) => {
  // Support both value/max and direct progress percentage
  const percent = progress !== undefined 
    ? Math.max(0, Math.min(progress, 100))
    : Math.max(0, Math.min((value ?? 0) / max, 1)) * 100;

  return (
    <div className={cn("space-y-1", className)}>
      {label ? <p className="text-xs text-white/60">{label}</p> : null}
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn("h-full rounded-full transition-[width]", variantStyles[variant])}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showPercent && (
        <p className="text-xs font-semibold text-white">
          {percent.toFixed(0)}%
        </p>
      )}
    </div>
  );
};
