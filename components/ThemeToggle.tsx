"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className="h-8 w-14 rounded-full bg-gray-200 p-1 transition-colors dark:bg-gray-800">
        <div className="h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-300" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`focus:ring-pnj-blue relative h-9 w-16 rounded-full p-1 transition-colors duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
        isDark
          ? "bg-gray-800 ring-offset-black"
          : "bg-gray-200 ring-offset-white"
      }`}
      title={isDark ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
      aria-label="Toggle Theme"
    >
      <div
        className={`flex h-7 w-7 transform items-center justify-center rounded-full shadow-md transition-transform duration-300 ${
          isDark
            ? "translate-x-7 bg-black text-white"
            : "translate-x-0 bg-white text-yellow-500"
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
