import React, { useState } from 'react';
import {
    Home, Info, FileText, Settings, BookOpen, Compass,
    Ban, ChevronLeft, ChevronRight, Mic, Book, MoreHorizontal, X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../Logo';

type Page = 'home' | 'dzikir' | 'quran' | 'qibla' | 'about' | 'documentation' | 'boycott' | 'khutbah';

interface MainLayoutProps {
    children: React.ReactNode;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onToggleSettings: () => void;
}

const navItems = [
    { id: 'home'    as Page, label: 'Home',       icon: Home },
    { id: 'dzikir'  as Page, label: 'Dzikir',     icon: Book },
    { id: 'quran'   as Page, label: "Al-Qur'an",  icon: BookOpen },
    { id: 'qibla'   as Page, label: 'Kiblat',     icon: Compass },
    { id: 'khutbah' as Page, label: 'Khutbah',    icon: Mic },
    { id: 'boycott' as Page, label: 'Cek Boikot', icon: Ban },
];

const secondaryItems = [
    { id: 'about'         as Page, label: 'Tentang',    icon: Info },
    { id: 'documentation' as Page, label: 'Dokumentasi', icon: FileText },
];

const mobileMainItems = [
    { id: 'home'   as Page, label: 'Home',    icon: Home },
    { id: 'dzikir' as Page, label: 'Dzikir',  icon: Book },
    { id: 'quran'  as Page, label: "Qur'an",  icon: BookOpen },
    { id: 'qibla'  as Page, label: 'Kiblat',  icon: Compass },
];

const mobileOverflowItems = [
    { id: 'khutbah'       as Page, label: 'Khutbah Jumat', icon: Mic },
    { id: 'boycott'       as Page, label: 'Cek Boikot',    icon: Ban },
    { id: 'about'         as Page, label: 'Tentang',        icon: Info },
    { id: 'documentation' as Page, label: 'Dokumentasi',    icon: FileText },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, onNavigate, onToggleSettings }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const handleMobileNav = (page: Page) => {
        onNavigate(page);
        setShowMoreMenu(false);
    };

    return (
        <div className="flex min-h-screen relative text-[var(--text-main)]">

            {/* ── Desktop Sidebar ─────────────── */}
            <aside
                className={`hidden lg:flex flex-col h-screen fixed left-0 top-0 z-40 m-4 rounded-3xl
                    bg-white/65 dark:bg-slate-900/70 backdrop-blur-2xl
                    border border-white/50 dark:border-white/8
                    shadow-[0_4px_24px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                    transition-all duration-300 overflow-hidden
                    ${isCollapsed ? 'w-[4.5rem]' : 'w-64'}`}
            >
                {/* Logo header */}
                <div className={`flex items-center border-b border-gray-100/50 dark:border-white/8 transition-all duration-300
                    ${isCollapsed ? 'justify-center p-4' : 'justify-between px-5 py-4'}`}
                >
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.div
                                key="logo"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Logo />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        aria-label={isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
                        className="p-2 rounded-xl hover:bg-primary/10 dark:hover:bg-white/8 text-[var(--text-muted)] hover:text-primary transition-colors"
                    >
                        {isCollapsed
                            ? <ChevronRight className="w-4 h-4" />
                            : <ChevronLeft className="w-4 h-4" />
                        }
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 flex flex-col gap-1 p-2.5 overflow-y-auto no-scrollbar">
                    {!isCollapsed && (
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.18em] px-3 pt-3 pb-1">
                            Menu
                        </p>
                    )}

                    {navItems.map((item) => {
                        const active = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                title={isCollapsed ? item.label : ''}
                                className={`relative flex items-center gap-3 rounded-xl transition-all duration-200 group
                                    ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5'}
                                    ${active
                                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                                        : 'text-[var(--text-muted)] hover:text-primary hover:bg-primary/8 dark:hover:bg-white/6'
                                    }`}
                            >
                                <item.icon className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isCollapsed ? 'w-5 h-5' : 'w-4.5 h-4.5'}`} />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="text-sm font-semibold overflow-hidden whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {/* Active dot in collapsed mode */}
                                {active && isCollapsed && (
                                    <motion.span
                                        layoutId="nav-active-dot"
                                        className="absolute right-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-accent"
                                    />
                                )}
                            </button>
                        );
                    })}

                    <div className="my-2 mx-2 border-t border-gray-100/50 dark:border-white/8" />

                    {!isCollapsed && (
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.18em] px-3 pb-1">
                            Info
                        </p>
                    )}

                    {secondaryItems.map((item) => {
                        const active = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                title={isCollapsed ? item.label : ''}
                                className={`flex items-center gap-3 rounded-xl transition-all duration-200
                                    ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5'}
                                    ${active
                                        ? 'bg-primary text-white shadow-md shadow-primary/30'
                                        : 'text-[var(--text-muted)] hover:text-primary hover:bg-primary/8 dark:hover:bg-white/6'
                                    }`}
                            >
                                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 'auto' }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="text-sm font-semibold overflow-hidden whitespace-nowrap"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        );
                    })}

                    {/* Settings at bottom */}
                    <div className="mt-auto pt-2 border-t border-gray-100/50 dark:border-white/8">
                        <button
                            onClick={onToggleSettings}
                            title={isCollapsed ? 'Pengaturan' : ''}
                            className={`flex items-center gap-3 rounded-xl w-full transition-all duration-200
                                text-[var(--text-muted)] hover:text-primary hover:bg-primary/8 dark:hover:bg-white/6
                                ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5'}`}
                        >
                            <Settings className="w-4.5 h-4.5 flex-shrink-0" />
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="text-sm font-semibold overflow-hidden whitespace-nowrap"
                                    >
                                        Pengaturan
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* ── Main Content ─────────────────── */}
            <main className={`flex-1 p-4 pb-28 md:pb-10 lg:p-8 max-w-5xl mx-auto w-full transition-all duration-300
                ${isCollapsed ? 'lg:ml-24' : 'lg:ml-72'}`}
            >
                {children}
            </main>

            {/* ── Mobile Bottom Nav ─────────────── */}
            <nav
                aria-label="Navigasi utama"
                className="lg:hidden fixed bottom-0 left-0 w-full z-50 pb-safe
                    bg-white/85 dark:bg-slate-900/88 backdrop-blur-2xl
                    border-t border-white/60 dark:border-white/8
                    shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
            >
                <div className="flex justify-around items-center px-2 py-1">
                    {mobileMainItems.map((item) => {
                        const active = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMobileNav(item.id)}
                                aria-label={item.label}
                                aria-current={active ? 'page' : undefined}
                                className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl min-w-0 flex-1"
                            >
                                <div className={`p-1.5 rounded-xl transition-all duration-200 ${active ? 'bg-primary/12' : ''}`}>
                                    <item.icon className={`w-5 h-5 transition-colors duration-200 ${active ? 'text-primary' : 'text-[var(--text-muted)]'}`} />
                                </div>
                                <span className={`text-[10px] font-semibold leading-tight transition-colors duration-200 ${active ? 'text-primary' : 'text-[var(--text-muted)]'}`}>
                                    {item.label}
                                </span>
                                {active && (
                                    <motion.div
                                        layoutId="mobile-active"
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary"
                                    />
                                )}
                            </button>
                        );
                    })}

                    {/* More button */}
                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        aria-label="Menu lainnya"
                        aria-expanded={showMoreMenu}
                        className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-xl min-w-0 flex-1"
                    >
                        <div className={`p-1.5 rounded-xl transition-all duration-200 ${showMoreMenu ? 'bg-primary/12' : ''}`}>
                            {showMoreMenu
                                ? <X className="w-5 h-5 text-primary" />
                                : <MoreHorizontal className="w-5 h-5 text-[var(--text-muted)]" />
                            }
                        </div>
                        <span className={`text-[10px] font-semibold leading-tight transition-colors ${showMoreMenu ? 'text-primary' : 'text-[var(--text-muted)]'}`}>
                            Lainnya
                        </span>
                    </button>
                </div>
            </nav>

            {/* ── Mobile More Menu Overlay ─────── */}
            <AnimatePresence>
                {showMoreMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMoreMenu(false)}
                            className="lg:hidden fixed inset-0 bg-black/25 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 60, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.97 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                            className="lg:hidden fixed bottom-[4.5rem] left-3 right-3 z-50 p-3 rounded-2xl
                                bg-white/95 dark:bg-slate-900/96 backdrop-blur-2xl
                                border border-white/60 dark:border-white/10
                                shadow-xl shadow-black/15"
                        >
                            <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-gray-100 dark:border-white/8">
                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
                                    Menu Lainnya
                                </span>
                                <button onClick={() => setShowMoreMenu(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8">
                                    <X className="w-4 h-4 text-[var(--text-muted)]" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {mobileOverflowItems.map((item) => {
                                    const active = currentPage === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleMobileNav(item.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium
                                                ${active
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'text-[var(--text-main)] hover:bg-gray-50 dark:hover:bg-white/6'
                                                }`}
                                        >
                                            <item.icon className="w-4.5 h-4.5" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => { onToggleSettings(); setShowMoreMenu(false); }}
                                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-white/6 text-[var(--text-main)] text-sm font-medium"
                                >
                                    <Settings className="w-4.5 h-4.5" />
                                    Pengaturan
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MainLayout;
