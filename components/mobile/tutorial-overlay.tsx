"use client";

import React, { useEffect, useState } from "react";

type TutorialOverlayProps = {
    isVisible: boolean;
    onDismiss: () => void;
};

export const TutorialOverlay = ({
    isVisible,
    onDismiss,
}: TutorialOverlayProps) => {
    const [buttonPosition, setButtonPosition] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);

    useEffect(() => {
        if (!isVisible) return;

        const findButton = () => {
            // Find the button containing "I'm Ryt Here" text
            const buttons = document.querySelectorAll("button");
            let found = false;

            for (const btn of buttons) {
                if (btn.textContent?.includes("I'm Ryt Here")) {
                    const rect = btn.getBoundingClientRect();
                    const mobileContainer = document.querySelector(
                        ".max-w-md.mx-auto"
                    );
                    if (mobileContainer) {
                        const containerRect =
                            mobileContainer.getBoundingClientRect();
                        setButtonPosition({
                            x:
                                rect.left -
                                containerRect.left +
                                rect.width / 2,
                            y:
                                rect.top -
                                containerRect.top +
                                rect.height / 2,
                            width: rect.width,
                            height: rect.height,
                        });
                        found = true;
                        break;
                    }
                }
            }

            if (!found) {
                setTimeout(findButton, 100);
            }
        };

        findButton();

        // Handle any interaction to dismiss
        const handleInteraction = () => {
            onDismiss();
        };

        document.addEventListener("click", handleInteraction);
        document.addEventListener("touchstart", handleInteraction);

        return () => {
            document.removeEventListener("click", handleInteraction);
            document.removeEventListener("touchstart", handleInteraction);
        };
    }, [isVisible, onDismiss]);

    if (!isVisible || !buttonPosition) {
        return null;
    }

    return (
        <div className="absolute inset-0 z-45">
            {/* Semi-transparent overlay with spotlight on button */}
            <div
                className="absolute inset-0 pointer-events-auto cursor-pointer"
                onClick={onDismiss}
                style={{
                    background: `
                        radial-gradient(
                            circle 85px at ${buttonPosition.x}px ${buttonPosition.y}px,
                            transparent 0%,
                            transparent 110px,
                            rgba(0, 0, 0, 0.5) 110%
                        )
                    `,
                }}
            />

            {/* Arrow and text - pointer events none so they don't interfere */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Arrow SVG positioned above the button */}
                <svg
                    className="absolute"
                    style={{
                        left: `${buttonPosition.x}px`,
                        top: `${buttonPosition.y - 120}px`,
                        transform: "translateX(-50%)",
                        width: "100px",
                        height: "100px",
                    }}
                    viewBox="0 0 100 100"
                >
                    {/* Arrow pointing down */}
                    <defs>
                        <filter id="arrow-shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow
                                dx="0"
                                dy="2"
                                stdDeviation="3"
                                floodOpacity="0.4"
                            />
                        </filter>
                    </defs>
                    <path
                        d="M 50 10 L 65 35 L 55 35 L 55 70 L 45 70 L 45 35 L 35 35 Z"
                        fill="white"
                        filter="url(#arrow-shadow)"
                        className="animate-bounce"
                    />
                </svg>

                {/* Text label */}
                <div
                    className="absolute text-white text-center font-semibold"
                    style={{
                        left: `${buttonPosition.x}px`,
                        top: `${buttonPosition.y - 180}px`,
                        transform: "translateX(-50%)",
                        width: "220px",
                    }}
                >
                    <div className="text-sm font-bold drop-shadow-lg">
                        Access AI Features
                    </div>
                    <div className="text-xs opacity-90 mt-1 drop-shadow-lg">
                        Tap the button or anywhere to dismiss
                    </div>
                </div>
            </div>
        </div>
    );
};
