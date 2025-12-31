"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, toggleTheme, mounted } = useTheme();

    if (!mounted) {
        return (
            <div className="w-14 h-8 bg-gray-200 rounded-full p-1 transition-colors dark:bg-gray-800">
                <div className="w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300" />
            </div>
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            className={`relative w-16 h-9 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pnj-blue ${isDark ? 'bg-gray-800 ring-offset-black' : 'bg-gray-200 ring-offset-white'
                }`}
            title={isDark ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
            aria-label="Toggle Theme"
        >
            <div
                className={`w-7 h-7 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDark
                    ? 'translate-x-7 bg-black text-white'
                    : 'translate-x-0 bg-white text-yellow-500'
                    }`}
            >
                {isDark ? (
                    <Moon size={14} fill="currentColor" />
                ) : (
                    <Sun size={14} fill="currentColor" />
                )}
            </div>
        </button>
    );
}

