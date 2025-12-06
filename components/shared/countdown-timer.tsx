const getDaysRemaining = (targetDate: string) => {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const CountdownTimer = ({ to }: { to: string }) => {
  const days = getDaysRemaining(to);
  if (days === 0) return <span className="text-xs text-muted-foreground">Due today</span>;
  return (
    <span className="text-xs font-semibold text-foreground">
      {days} day{days === 1 ? "" : "s"} remaining
    </span>
  );
};
