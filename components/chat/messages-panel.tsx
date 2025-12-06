"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChatMessage } from "@/components/chat/chat-message";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BankUIMessage } from "@/types/ui";

interface MessagesPanelProps {
  messages: BankUIMessage[];
  status: string;
  getVisiblePartsForMessage: (message: BankUIMessage) => {
    hasToolContent: boolean;
    visibleParts: ReactNode[];
    hasTextContent: boolean;
    isAwaitingAnalysis: boolean;
  };
  isScrollLocked?: boolean;
}

export const MessagesPanel = ({
  messages,
  status,
  getVisiblePartsForMessage,
  isScrollLocked = false,
}: MessagesPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    // Lock/unlock scroll on viewport
    if (scrollViewportRef.current) {
      const viewport = scrollViewportRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
      if (viewport) {
        if (isScrollLocked) {
          viewport.style.overflowY = "hidden";
        } else {
          viewport.style.overflowY = "";
        }
      }
    }
  }, [isScrollLocked]);

  const lastMessage = messages[messages.length - 1];
  const lastVisibility = lastMessage
    ? getVisiblePartsForMessage(lastMessage as BankUIMessage)
    : { visibleParts: [], hasToolContent: false, hasTextContent: false, isAwaitingAnalysis: false };
  
  // Show typing indicator when:
  // 1. We're streaming and no visible content yet, OR
  // 2. We're streaming and the last message is awaiting analysis (query_transactions without text yet)
  const waitingForAssistant =
    (status === "submitted" || status === "streaming") &&
    (!(lastMessage?.role === "assistant" && lastVisibility.visibleParts.length > 0) ||
      lastVisibility.isAwaitingAnalysis);

  return (
    <div ref={scrollViewportRef} className="flex h-full flex-col min-h-0 overflow-hidden">
      <ScrollArea 
        className="h-full flex-1 min-h-0"
      >
        <div className="flex flex-col gap-3 p-0 pb-2">
          {messages
            .map((message) => {
              const { hasToolContent, visibleParts } =
                getVisiblePartsForMessage(message as BankUIMessage);
              const role = message.role as "user" | "assistant";

              if (role === "assistant" && visibleParts.length === 0) {
                return null;
              }

              return (
                <ChatMessage
                  key={message.id}
                  role={role}
                  hasToolContent={hasToolContent}
                >
                  <div className="space-y-3">{visibleParts}</div>
                </ChatMessage>
              );
            })
            .filter(Boolean)}
          {waitingForAssistant ? (
            <div className="flex w-full justify-start">
              <TypingIndicator />
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};
