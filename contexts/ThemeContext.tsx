"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { },
    mounted: false
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme: Theme = "light";
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.documentElement.classList.remove("dark");
        localStorage.removeItem("theme");
    }, []);

    const toggleTheme = () => {
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

