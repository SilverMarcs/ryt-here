"use client";

import { useMemo, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { Shield, Sparkles } from "lucide-react";
import { ChatInput } from "@/components/chat/chat-input";
import { MessagesPanel } from "@/components/chat/messages-panel";
import { useToolOutputApplier } from "@/components/chat/hooks/use-tool-output-applier";
import { useToolRenderers } from "@/components/chat/hooks/use-tool-renderers";
import { useBank } from "@/contexts/bank-context";
import { BankUIMessage } from "@/types/ui";

const welcomeMessages: BankUIMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hi! I'm your MyBank assistant. Ask me to analyse spending, show transactions, or prep a transfer.",
      },
    ],
  },
];

export const ChatExperience = () => {
  const {
    state,
    setState,
    executeTransfer,
    setCardStatus,
    setTransactionLimit,
    contributeToGoal,
  } = useBank();
  const [input, setInput] = useState("");
  const [pendingLimits, setPendingLimits] = useState<
    Record<string, number | undefined>
  >({});

  const transport = useMemo(
    () =>
      new DefaultChatTransport<BankUIMessage>({
        api: "/api/chat",
        body: () => ({ bankState: state }),
      }),
    [state],
  );

  const { messages, sendMessage, status, addToolOutput } =
    useChat<BankUIMessage>({
      id: "mybank-chat",
      messages: welcomeMessages,
      transport,
    });

  useToolOutputApplier({
    messages: messages as BankUIMessage[],
    setCardStatus,
    setState,
    setTransactionLimit,
  });

  const { getVisiblePartsForMessage } = useToolRenderers({
    state,
    executeTransfer,
    addToolOutput,
    pendingLimits,
    setPendingLimits,
    setCardStatus,
    setTransactionLimit,
    contributeToGoal,
  });

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="flex flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground backdrop-blur-md">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4" />
            Ask for spending analysis, transaction history, or transfers.
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-foreground">
            <Shield className="h-3.5 w-3.5" />
            Secure
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <MessagesPanel
            messages={messages as BankUIMessage[]}
            status={status}
            getVisiblePartsForMessage={getVisiblePartsForMessage}
          />
        </div>
      </div>
      <div className="sticky bottom-0 left-0 right-0 rounded-t-2xl border-t border-border bg-card py-3 backdrop-blur-md">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={status === "streaming" || status === "submitted"}
        />
      </div>
    </div>
  );
};
