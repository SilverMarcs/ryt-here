export const TypingIndicator = () => (
  <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 text-xs text-white/70 shadow-lg">
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white/50" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-white/50 delay-150" />
      <span className="h-2 w-2 animate-pulse rounded-full bg-white/50 delay-300" />
    </div>
  </div>
);
