"use client";

import { useState, useRef, useEffect } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { Shield, Sparkles } from "lucide-react";
import { ChatInput } from "@/components/chat/chat-input";
import { MessagesPanel } from "@/components/chat/messages-panel";
import { QuickActionsPopup } from "@/components/chat/quick-actions-popup";
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
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Use ref to always get the latest state
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const transport = new DefaultChatTransport<BankUIMessage>({
    api: "/api/chat",
    body: () => ({ bankState: stateRef.current }),
  });

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

  const handleResetLimit = async () => {
    setIsResetting(true);
    await setTransactionLimit(state.user.card.defaultTransactionLimit);
    setTimeout(() => setIsResetting(false), 500);
  };

  const handleQuickAction = async (prompt: string) => {
    setInput("");
    await sendMessage({ text: prompt });
  };

    return (
        <div className="flex h-full w-full flex-col gap-4 overflow-hidden">
            <div className="flex flex-1 min-h-0 flex-col gap-3 overflow-hidden">
                <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 text-xs shrink-0">
                    <div className="flex items-center gap-2 font-semibold text-white">
                        <Sparkles className="h-4 w-4" />
                        Ask for spending analysis, transaction history, or
                        transfers.
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-white">
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
            <div className="shrink-0 rounded-t-2xl border-t border-white/20 bg-white/10 backdrop-blur-md py-3">
                {state.user.card.transactionLimit !== state.user.card.defaultTransactionLimit && (
          <div className="mb-2 flex items-center justify-center">
            <button
              onClick={handleResetLimit}
              disabled={isResetting}
              className="flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted/80 hover:border-primary/50 active:scale-95 disabled:opacity-70"
            >
              <span>Limit changed to {state.user.currency} {state.user.card.transactionLimit}</span>
              <span className="text-muted-foreground">•</span>
              <span className={`text-primary transition-all ${isResetting ? 'scale-95 opacity-70' : ''}`}>
                {isResetting ? 'Resetting...' : 'Reset to default'}
              </span>
            </button>
          </div>
        )}
        <div className="relative">
          <ChatInput
                      value={input}
                      onChange={setInput}
                      onSubmit={handleSubmit}
                      disabled={status === "streaming" || status === "submitted"}
                    onQuickActionsClick={() => setShowQuickActions(true)}
          />
          {showQuickActions && (
            <QuickActionsPopup
              onClose={() => setShowQuickActions(false)}
              onSelectAction={handleQuickAction}
            />
          )}
        </div>
            </div>
        </div>
    );
};
