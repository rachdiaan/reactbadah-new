import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    showTranslation: boolean;
    toggleTranslation: () => void;
    showVerseActions: boolean;
    toggleVerseActions: () => void;
    arabicFontSize: number;
    setArabicFontSize: (size: number) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function safeGet<T>(key: string, fallback: T): T {
    try {
        const val = localStorage.getItem(key);
        return val !== null ? (JSON.parse(val) as T) : fallback;
    } catch {
        return fallback;
    }
}

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => safeGet('isDarkMode', false));
    const [showTranslation, setShowTranslation] = useState(() => safeGet('showTranslation', true));
    const [showVerseActions, setShowVerseActions] = useState(() => safeGet('showVerseActions', true));
    const [arabicFontSize, setArabicFontSize] = useState(() => safeGet('arabicFontSize', 28));

    useEffect(() => {
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
        // Apply dark mode class to html/body
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem('showTranslation', JSON.stringify(showTranslation));
    }, [showTranslation]);

    useEffect(() => {
        localStorage.setItem('showVerseActions', JSON.stringify(showVerseActions));
    }, [showVerseActions]);

    useEffect(() => {
        localStorage.setItem('arabicFontSize', JSON.stringify(arabicFontSize));
    }, [arabicFontSize]);

    return (
        <SettingsContext.Provider
            value={{
                isDarkMode,
                toggleDarkMode: () => setIsDarkMode(!isDarkMode),
                showTranslation,
                toggleTranslation: () => setShowTranslation(!showTranslation),
                showVerseActions,
                toggleVerseActions: () => setShowVerseActions(!showVerseActions),
                arabicFontSize,
                setArabicFontSize,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

