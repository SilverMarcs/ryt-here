import { ChatContainer } from "@/components/chat/chat-container";
import { ChatExperience } from "@/components/chat/chat-experience";
import { BankProvider } from "@/contexts/bank-context";

// Disable caching to ensure fresh state on every page load
export const dynamic = 'force-dynamic';

export default function ChatPage() {
  return (
    <BankProvider>
      {/* Pulsing gradient background */}
      <div className="ai-chat-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>
      <ChatContainer className="relative z-10 bg-transparent">
        <ChatExperience />
      </ChatContainer>
    </BankProvider>
  );
}
