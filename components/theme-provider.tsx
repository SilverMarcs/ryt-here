"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type ThemeMode = "light" | "dark";

const getSystemTheme = (): ThemeMode => {
    if (typeof window === "undefined") {
        return "light";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

const applyTheme = (mode: ThemeMode): void => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.style.setProperty("color-scheme", mode);
};

export function ThemeProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        const initialTheme = getSystemTheme();
        applyTheme(initialTheme);

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent): void => {
            const nextTheme: ThemeMode = event.matches ? "dark" : "light";
            applyTheme(nextTheme);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return <>{children}</>;
}
