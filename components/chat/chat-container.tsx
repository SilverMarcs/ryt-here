import { cn } from "@/lib/utils";

export const ChatContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "mx-auto flex h-screen w-full max-w-lg flex-col overflow-hidden bg-background px-4 pt-6 pb-0 sm:px-6 sm:pt-8",
        className,
      )}
    >
      {children}
    </div>
  );
};
