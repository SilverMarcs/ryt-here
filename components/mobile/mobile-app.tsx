"use client";

import React, { useState } from "react";
import { Shield } from "lucide-react";
import { HomeScreen } from "./home-screen";
import { InsightsScreen } from "./insights-screen";
import { ProfileScreen } from "./profile-screen";
import { RewardsScreen } from "./rewards-screen";
import { CardsScreen } from "./cards-screen";
import { type TabType } from "./bottom-navigation";
import { ChatContainer } from "@/components/chat/chat-container";
import { ChatExperience } from "@/components/chat/chat-experience";
import { BankProvider } from "@/contexts/bank-context";
import { UserProfileScreen } from "./user-profile-screen";

type TransitionState = {
    isActive: boolean;
    buttonX: number;
    buttonY: number;
    buttonWidth: number;
    buttonHeight: number;
};

export function MobileApp() {
    const [activeTab, setActiveTab] = useState<TabType>("home");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [transitionState, setTransitionState] =
        useState<TransitionState | null>(null);
    const [showChatContent, setShowChatContent] = useState(false);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
    };

    const handleOpenChat = (buttonRect: DOMRect, containerRect: DOMRect) => {
        // Calculate position relative to mobile component
        const relativeX =
            buttonRect.left - containerRect.left + buttonRect.width / 2;
        const relativeY =
            buttonRect.top - containerRect.top + buttonRect.height / 2;

        setTransitionState({
            isActive: true,
            buttonX: relativeX,
            buttonY: relativeY,
            buttonWidth: buttonRect.width,
            buttonHeight: buttonRect.height,
        });

        setTimeout(() => {
            setIsChatOpen(true);
            // Start fading overlay to reveal chat background
            setTimeout(() => {
                // After overlay fades, show chat content
                setShowChatContent(true);
                // Remove transition overlay after content is shown
                setTimeout(() => {
                    setTransitionState(null);
                }, 50);
            }, 10);
        }, 300);
    };

    const handleOpenChatWithRef = (buttonRect: DOMRect) => {
        if (mobileContainerRef.current) {
            const containerRect =
                mobileContainerRef.current.getBoundingClientRect();
            handleOpenChat(buttonRect, containerRect);
        }
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        setShowChatContent(false);
        setTimeout(() => {
            setTransitionState(null);
        }, 300);
    };

    const handleOpenProfile = () => {
        setIsProfileOpen(true);
    };

    const handleCloseProfile = () => {
        setIsProfileOpen(false);
    };

    const renderScreen = () => {
        switch (activeTab) {
            case "home":
                return (
                    <HomeScreen
                        onTabChange={handleTabChange}
                        onOpenChat={handleOpenChatWithRef}
                        onOpenProfile={handleOpenProfile}
                    />
                );
            case "insights":
                return <InsightsScreen onTabChange={handleTabChange} />;
            case "accounts":
                return <ProfileScreen onTabChange={handleTabChange} />;
            case "cards":
                return <CardsScreen onTabChange={handleTabChange} />;
            case "rewards":
                return <RewardsScreen onTabChange={handleTabChange} />;
            default:
                return (
                    <HomeScreen
                        onTabChange={handleTabChange}
                        onOpenChat={handleOpenChatWithRef}
                        onOpenProfile={handleOpenProfile}
                    />
                );
        }
    };

    const mobileContainerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="bg-muted h-screen overflow-hidden relative">
            <div
                ref={mobileContainerRef}
                className="max-w-md mx-auto bg-background shadow-2xl h-full overflow-y-auto overflow-x-hidden relative"
            >
                {/* Home Screen */}
                <div
                    className={`transition-opacity duration-300 ${
                        isChatOpen || isProfileOpen
                            ? "opacity-0 pointer-events-none"
                            : "opacity-100"
                    }`}
                >
                    {renderScreen()}
                </div>

                {/* Transition Overlay */}
                {transitionState && (
                    <div
                        className={`absolute inset-0 z-50 pointer-events-none chat-transition-overlay ${
                            isChatOpen ? "chat-background-transition" : ""
                        }`}
                        style={
                            {
                                background: `radial-gradient(circle at ${transitionState.buttonX}px ${transitionState.buttonY}px, 
                 #000000 0%,
                 #000000 100%
                )`,
                                "--start-x": `${transitionState.buttonX}px`,
                                "--start-y": `${transitionState.buttonY}px`,
                                "--start-size": `${
                                    Math.max(
                                        transitionState.buttonWidth,
                                        transitionState.buttonHeight
                                    ) / 2
                                }px`,
                            } as React.CSSProperties
                        }
                    />
                )}

                {/* Chat Screen */}
                {isChatOpen && (
                    <div
                        className="fixed inset-0 z-40 w-full dark flex items-center justify-center"
                        style={{
                            height: "100svh",
                            maxHeight: "100svh",
                        }}
                    >
                        <BankProvider>
                            <div
                                className="h-full w-full max-w-md mx-auto overflow-hidden relative"
                                style={{
                                    height: "100svh",
                                    maxHeight: "100svh",
                                }}
                            >
                                {/* Pulsing gradient background */}
                                <div className="absolute inset-0 ai-chat-bg opacity-100">
                                    <div className="orb orb-1" />
                                    <div className="orb orb-2" />
                                    <div className="orb orb-3" />
                                    <div className="orb orb-4" />
                                </div>
                                <div
                                    className="relative z-10 h-full flex flex-col"
                                    style={{
                                        height: "100svh",
                                        maxHeight: "100svh",
                                    }}
                                >
                                    <div
                                        className={`h-full flex flex-col overflow-hidden px-4 transition-opacity duration-300 ${
                                            showChatContent
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                        style={{
                                            paddingTop:
                                                "max(1rem, calc(env(safe-area-inset-top, 0px) + 1rem))",
                                            height: "100svh",
                                            maxHeight: "100svh",
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-4 shrink-0 relative">
                                            <button
                                                onClick={handleCloseChat}
                                                className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white hover:bg-white/20 transition-all border border-white/20"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 19l-7-7 7-7"
                                                    />
                                                </svg>
                                                <span className="text-sm font-medium">
                                                    Back
                                                </span>
                                            </button>
                                            <h1 className="text-lg font-semibold text-white absolute left-1/2 -translate-x-1/2">
                                                Ryt Here
                                            </h1>
                                            <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                                <Shield className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div
                                            className="flex-1 min-h-0 overflow-hidden"
                                            style={{
                                                maxHeight:
                                                    "calc(100svh - 12rem)",
                                            }}
                                        >
                                            <ChatExperience />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </BankProvider>
                    </div>
                )}

                {/* Profile Screen */}
                {isProfileOpen && (
                    <div className="absolute inset-0 z-40 h-full w-full bg-background animate-in slide-in-from-right duration-300">
                        <UserProfileScreen onClose={handleCloseProfile} />
                    </div>
                )}
            </div>
        </div>
    );
}
