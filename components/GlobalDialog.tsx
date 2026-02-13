"use client";

import { AlertCircle, HelpCircle, Info, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface GlobalDialogProps {
  isOpen: boolean;
  type: "alert" | "confirm" | "prompt";
  title?: string;
  message: string;
  defaultValue?: string;
  onClose: () => void;
  onConfirm: (value?: string) => void;
}

export default function GlobalDialog({
  isOpen,
  type,
  title,
  message,
  defaultValue = "",
  onClose,
  onConfirm,
}: GlobalDialogProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && type === "prompt") {
      setInputValue(defaultValue || "");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, type, defaultValue]);

  if (!isOpen) return null;

  const getDefaultTitle = () => {
    if (title) return title;
    switch (type) {
      case "alert":
        return "Informasi";
      case "confirm":
        return "Konfirmasi";
      case "prompt":
        return "Masukan Data";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "confirm":
        return <HelpCircle size={24} className="text-[#008C9D]" />;
      case "alert":
        return <Info size={24} className="text-[#008C9D]" />;
      case "prompt":
        return <AlertCircle size={24} className="text-[#008C9D]" />;
      default:
        return <Info size={24} className="text-[#008C9D]" />;
    }
  };

  const handleConfirm = () => {
    if (type === "prompt") {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm duration-200">
      <div
        className="animate-in zoom-in-95 w-full max-w-md scale-100 rounded-3xl bg-white p-6 shadow-2xl duration-200"
        onKeyDown={handleKeyDown}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#008C9D]/10">
            {getIcon()}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900">
          {getDefaultTitle()}
        </h3>
        <p className="mb-6 leading-relaxed text-gray-500">{message}</p>

        {type === "prompt" && (
          <div className="mb-6">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-[#008C9D] focus:outline-none"
              placeholder="Ketik disini..."
            />
          </div>
        )}

        <div className="flex gap-3">
          {type !== "alert" && (
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Batal
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#008C9D] px-4 py-3 font-bold text-white shadow-lg shadow-[#008C9D]/20 transition-colors hover:bg-[#007A8A]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
