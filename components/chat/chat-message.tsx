import { cn } from "@/lib/utils";

const UserMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full justify-end">
    <div className="max-w-[80%] rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 px-3 py-2 text-sm font-semibold text-white shadow-lg">
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
          : "max-w-[80%] space-y-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 pr-5 text-white shadow-lg",
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
