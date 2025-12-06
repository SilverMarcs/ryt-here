import { cn } from "@/lib/utils";

export const QRCodeDisplay = ({
  data,
  caption,
  className,
}: {
  data: string;
  caption?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/50 p-4 text-center",
        className,
      )}
    >
      <div className="h-32 w-32 rounded-xl bg-linear-to-br from-slate-200 via-slate-100 to-white p-3 shadow-inner">
        <div className="h-full w-full rounded-lg bg-[radial-gradient(circle_at_1px_1px,#0f172a_1px,transparent_0)] bg-size-[6px_6px]" />
      </div>
      {caption ? (
        <p className="text-xs text-muted-foreground">{caption}</p>
      ) : null}
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {data}
      </p>
    </div>
  );
};
