import { cn } from "@/lib/utils";

const UserMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full justify-end">
    <div className="max-w-[80%] rounded-2xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
      {children}
    </div>
  </div>
);

const AssistantMessage = ({
  children,
  hasToolContent,
}: {
  children: React.ReactNode;
  hasToolContent: boolean;
}) => (
  <div className={cn("flex w-full justify-start", !hasToolContent && "pr-4")}>
    <div
      className={cn(
        "text-sm",
        hasToolContent
          ? "w-full space-y-3"
          : "max-w-[80%] space-y-3 rounded-2xl border border-border bg-muted px-3 py-2 pr-5 text-foreground shadow-lg backdrop-blur-sm",
      )}
    >
      {children}
    </div>
  </div>
);

export const ChatMessage = ({
  role,
  children,
  hasToolContent = false,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
  hasToolContent?: boolean;
}) => {
  if (role === "user") {
    return <UserMessage>{children}</UserMessage>;
  }

  return (
    <AssistantMessage hasToolContent={hasToolContent}>
      {children}
    </AssistantMessage>
  );
};

export { UserMessage, AssistantMessage };
