"use client";

import { AlertCircle, HelpCircle, Info, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface GlobalDialogProps {
    isOpen: boolean;
    type: 'alert' | 'confirm' | 'prompt';
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
    onConfirm
}: GlobalDialogProps) {
    const [inputValue, setInputValue] = useState(defaultValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && type === 'prompt') {
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
            case 'alert': return 'Informasi';
            case 'confirm': return 'Konfirmasi';
            case 'prompt': return 'Masukan Data';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'confirm': return <HelpCircle size={24} className="text-[#008C9D]" />;
            case 'alert': return <Info size={24} className="text-[#008C9D]" />;
            case 'prompt': return <AlertCircle size={24} className="text-[#008C9D]" />;
            default: return <Info size={24} className="text-[#008C9D]" />;
        }
    };

    const handleConfirm = () => {
        if (type === 'prompt') {
            onConfirm(inputValue);
        } else {
            onConfirm();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
                onKeyDown={handleKeyDown}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#008C9D]/10 flex items-center justify-center">
                        {getIcon()}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{getDefaultTitle()}</h3>
                <p className="text-gray-500 mb-6 leading-relaxed">
                    {message}
                </p>

                {type === 'prompt' && (
                    <div className="mb-6">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008C9D] focus:border-transparent transition-all"
                            placeholder="Ketik disini..."
                        />
                    </div>
                )}

                <div className="flex gap-3">
                    {type !== 'alert' && (
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#008C9D] hover:bg-[#007A8A] transition-colors shadow-lg shadow-[#008C9D]/20 flex items-center justify-center gap-2"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
