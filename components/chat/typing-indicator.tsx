export const TypingIndicator = () => (
  <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted px-3 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur-sm">
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-150" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 delay-300" />
    </div>
  </div>
);
