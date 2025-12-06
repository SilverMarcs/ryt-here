"use client";

import { useState, useRef, useEffect } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { Check, Zap } from "lucide-react";
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
                text: "Hi! I'm Ryt Here. Ask me to analyse spending, show transactions, or prep a transfer.",
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
    const [resetSuccess, setResetSuccess] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Use ref to always get the latest state
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Handle visual viewport changes for mobile keyboard
    const inputRef = useRef<HTMLInputElement>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === "undefined" || !window.visualViewport) {
            return;
        }

        const initialViewportHeight = window.visualViewport.height;
        const threshold = 150; // Consider keyboard open if viewport shrinks by more than 150px

        const handleViewportChange = () => {
            if (chatContainerRef.current && window.visualViewport) {
                const viewportHeight = window.visualViewport.height;
                const viewportTop = window.visualViewport.offsetTop;
                const container = chatContainerRef.current.closest(
                    '[style*="height"]'
                ) as HTMLElement;

                // Detect if keyboard is open
                const keyboardOpen =
                    initialViewportHeight - viewportHeight > threshold;
                setIsKeyboardOpen(keyboardOpen);

                if (container) {
                    container.style.height = `${viewportHeight}px`;
                    container.style.maxHeight = `${viewportHeight}px`;
                    if (viewportTop > 0) {
                        container.style.transform = `translateY(${viewportTop}px)`;
                    } else {
                        container.style.transform = "none";
                    }
                }

                // Lock scroll on messages container when keyboard is open
                if (messagesContainerRef.current) {
                    if (keyboardOpen) {
                        messagesContainerRef.current.style.overflow = "hidden";
                        messagesContainerRef.current.style.height = "100%";
                    } else {
                        messagesContainerRef.current.style.overflow = "";
                        messagesContainerRef.current.style.height = "";
                    }
                }
            }
        };

        // Initial set
        handleViewportChange();

        window.visualViewport.addEventListener("resize", handleViewportChange);
        window.visualViewport.addEventListener("scroll", handleViewportChange);

        return () => {
            window.visualViewport?.removeEventListener(
                "resize",
                handleViewportChange
            );
            window.visualViewport?.removeEventListener(
                "scroll",
                handleViewportChange
            );
        };
    }, []);

    // Update messages container padding when keyboard state or input height changes
    useEffect(() => {
        if (messagesContainerRef.current && inputContainerRef.current) {
            if (isKeyboardOpen) {
                const height = inputContainerRef.current.offsetHeight;
                messagesContainerRef.current.style.paddingBottom = `${height}px`;
            } else {
                messagesContainerRef.current.style.paddingBottom = "0px";
            }
        }
    }, [isKeyboardOpen]);

    const transport = new DefaultChatTransport<BankUIMessage>({
        api: "/api/chat",
        body: () => ({ bankState: stateRef.current }),
    });

    const { messages, sendMessage, status, addToolOutput } =
        useChat<BankUIMessage>({
            id: "ryt-here-chat",
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
        setState,
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
        setIsResetting(false);
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 1500);
    };

    const handleQuickAction = async (prompt: string) => {
        setInput("");
        await sendMessage({ text: prompt });
    };

    return (
        <div
            ref={chatContainerRef}
            className="flex h-full w-full flex-col overflow-hidden"
            style={{
                minHeight:
                    isKeyboardOpen && window.visualViewport
                        ? `${window.visualViewport.height}px`
                        : undefined,
            }}
        >
            <div className="flex flex-1 min-h-0 flex-col gap-3 overflow-hidden pb-2">
                {/* <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 text-xs shrink-0">
                    <div className="flex items-center gap-2 font-semibold text-white">
                        <Sparkles className="h-4 w-4" />
                        Ask for spending analysis, transaction history, or
                        transfers.
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 text-white">
                        <Shield className="h-3.5 w-3.5" />
                        Secure
                    </div>
                </div> */}
                <div
                    ref={messagesContainerRef}
                    className="flex min-h-0 flex-1 flex-col overflow-hidden"
                    style={{
                        paddingBottom:
                            isKeyboardOpen && inputContainerRef.current
                                ? `${inputContainerRef.current.offsetHeight}px`
                                : "0px",
                    }}
                >
                    <MessagesPanel
                        messages={messages as BankUIMessage[]}
                        status={status}
                        getVisiblePartsForMessage={getVisiblePartsForMessage}
                        isScrollLocked={isKeyboardOpen}
                    />
                </div>
            </div>
            <div
                ref={inputContainerRef}
                className={`shrink-0 rounded-t-2xl border-t border-white/20 bg-white/10 backdrop-blur-md px-4 py-4 ${
                    isKeyboardOpen ? "input-fixed-bottom" : "mt-auto"
                }`}
            >
                {(state.user.card.transactionLimit !==
                    state.user.card.defaultTransactionLimit ||
                    resetSuccess) && (
                    <div className="mb-3 flex items-center justify-center">
                        {resetSuccess ? (
                            <div className="flex items-center gap-2 rounded-full border border-green-400/30 bg-green-500/20 backdrop-blur-md px-4 py-2 text-xs font-medium text-green-300 animate-in fade-in zoom-in-95 duration-200">
                                <Check className="h-3.5 w-3.5" />
                                <span>Limit reset to default</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleResetLimit}
                                disabled={isResetting}
                                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-xs font-medium text-white transition-all hover:bg-white/20 hover:border-white/30 active:scale-95 disabled:opacity-70"
                            >
                                <span>
                                    Limit changed to {state.user.currency}{" "}
                                    {state.user.card.transactionLimit}
                                </span>
                                <span className="text-white/50">•</span>
                                <span
                                    className={`text-blue-400 transition-all ${
                                        isResetting ? "scale-95 opacity-70" : ""
                                    }`}
                                >
                                    {isResetting
                                        ? "Resetting..."
                                        : "Reset to default"}
                                </span>
                            </button>
                        )}
                    </div>
                )}
                <div className="relative flex items-end gap-3">
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => setShowQuickActions(true)}
                            aria-label="Quick actions"
                            className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
                        >
                            <Zap className="h-5 w-5" />
                        </button>
                        {showQuickActions && (
                            <QuickActionsPopup
                                onClose={() => setShowQuickActions(false)}
                                onSelectAction={handleQuickAction}
                            />
                        )}
                    </div>
                    <div className="flex-1 relative">
                        <ChatInput
                            inputRef={inputRef}
                            value={input}
                            onChange={setInput}
                            onSubmit={handleSubmit}
                            disabled={
                                status === "streaming" || status === "submitted"
                            }
                            onQuickActionsClick={() =>
                                setShowQuickActions(true)
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
