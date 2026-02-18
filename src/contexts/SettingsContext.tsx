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

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Dark Mode
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('isDarkMode');
        return saved ? JSON.parse(saved) : false;
    });

    // Show Translation
    const [showTranslation, setShowTranslation] = useState(() => {
        const saved = localStorage.getItem('showTranslation');
        return saved ? JSON.parse(saved) : true;
    });

    // Show Verse Actions (Play, Bookmark, etc.)
    const [showVerseActions, setShowVerseActions] = useState(() => {
        const saved = localStorage.getItem('showVerseActions');
        return saved ? JSON.parse(saved) : true;
    });

    // Arabic Font Size (Default 28px)
    const [arabicFontSize, setArabicFontSize] = useState(() => {
        const saved = localStorage.getItem('arabicFontSize');
        return saved ? JSON.parse(saved) : 28;
    });

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

