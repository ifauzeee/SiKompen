"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import GlobalDialog from '@/components/GlobalDialog';

export type DialogType = 'alert' | 'confirm' | 'prompt';

interface DialogOptions {
    title?: string;
    message: string;
    defaultValue?: string;
}

interface DialogContextType {
    showAlert: (message: string, title?: string) => Promise<void>;
    showConfirm: (message: string, title?: string) => Promise<boolean>;
    showPrompt: (message: string, defaultValue?: string, title?: string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<DialogType>('alert');
    const [options, setOptions] = useState<DialogOptions>({ message: '' });

    const resolveRef = useRef<(value: any) => void>(() => { });

    const openDialog = useCallback((dialogType: DialogType, dialogOptions: DialogOptions) => {
        return new Promise<any>((resolve) => {
            setType(dialogType);
            setOptions(dialogOptions);
            setIsOpen(true);
            resolveRef.current = resolve;
        });
    }, []);

    const handleClose = useCallback((value: any) => {
        setIsOpen(false);
        resolveRef.current(value);
    }, []);

    const showAlert = useCallback(async (message: string, title?: string) => {
        await openDialog('alert', { message, title });
    }, [openDialog]);

    const showConfirm = useCallback(async (message: string, title?: string) => {
        const result = await openDialog('confirm', { message, title });
        return result === true;
    }, [openDialog]);

    const showPrompt = useCallback(async (message: string, defaultValue?: string, title?: string) => {
        return await openDialog('prompt', { message, defaultValue, title });
    }, [openDialog]);

    return (
        <DialogContext.Provider value={{ showAlert, showConfirm, showPrompt }}>
            {children}
            <GlobalDialog
                isOpen={isOpen}
                type={type}
                title={options.title}
                message={options.message}
                defaultValue={options.defaultValue}
                onClose={() => handleClose(type === 'confirm' ? false : type === 'prompt' ? null : undefined)}
                onConfirm={(value?: string) => handleClose(type === 'confirm' ? true : type === 'prompt' ? value : undefined)}
            />
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
}
