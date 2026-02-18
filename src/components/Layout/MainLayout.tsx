import React, { useState } from 'react';
import { Home, Info, FileText, Settings, BookOpen, Compass, Ban, ChevronLeft, ChevronRight, Mic, Book, MoreHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../Logo';

type Page = 'home' | 'dzikir' | 'quran' | 'qibla' | 'about' | 'documentation' | 'boycott' | 'khutbah';

interface MainLayoutProps {
    children: React.ReactNode;
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onToggleSettings: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    currentPage,
    onNavigate,
    onToggleSettings
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const navItems = [
        { id: 'home' as Page, label: 'Home', icon: Home },
        { id: 'dzikir' as Page, label: 'Dzikir', icon: Book },
        { id: 'quran' as Page, label: "Al-Qur'an", icon: BookOpen },
        { id: 'qibla' as Page, label: 'Kiblat', icon: Compass },
        { id: 'khutbah' as Page, label: 'Khutbah', icon: Mic },
        { id: 'boycott' as Page, label: 'Cek Boikot', icon: Ban },
    ];

    const secondaryNavItems = [
        { id: 'about' as Page, label: 'About', icon: Info },
        { id: 'documentation' as Page, label: 'Docs', icon: FileText },
    ];

    // Mobile: 4 core items + More
    const mobileMainItems = [
        { id: 'home' as Page, label: 'Home', icon: Home },
        { id: 'dzikir' as Page, label: 'Dzikir', icon: Book },
        { id: 'quran' as Page, label: "Qur'an", icon: BookOpen },
        { id: 'qibla' as Page, label: 'Kiblat', icon: Compass },
    ];

    const mobileOverflowItems = [
        { id: 'khutbah' as Page, label: 'Khutbah Jumat', icon: Mic },
        { id: 'boycott' as Page, label: 'Cek Boikot', icon: Ban },
        { id: 'about' as Page, label: 'Tentang', icon: Info },
        { id: 'documentation' as Page, label: 'Dokumentasi', icon: FileText },
    ];

    const handleMobileNav = (page: Page) => {
        onNavigate(page);
        setShowMoreMenu(false);
    };

    return (
        <div className="flex min-h-screen relative text-gray-800 dark:text-gray-100">

            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex flex-col h-screen fixed left-0 top-0 glass-card m-4 my-4 rounded-3xl z-40 border-opacity-40 bg-white/60 dark:bg-slate-900/60 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-gray-200/30 dark:border-white/10`}>
                    {!isCollapsed && <Logo />}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto no-scrollbar">
                    <div className={`text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-2 mt-2 ${isCollapsed ? 'text-center' : ''}`}>
                        {isCollapsed ? '•' : 'Menu'}
                    </div>

                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${currentPage === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'hover:bg-primary/10 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                            title={isCollapsed ? item.label : ''}
                        >
                            <item.icon className={`w-5 h-5 ${isCollapsed ? 'w-6 h-6' : ''}`} />
                            {!isCollapsed && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}

                    <div className="my-2 border-t border-gray-200/30 dark:border-white/10"></div>

                    <div className={`text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-2 mt-2 ${isCollapsed ? 'text-center' : ''}`}>
                        {isCollapsed ? '•' : 'Info'}
                    </div>

                    {secondaryNavItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentPage === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'hover:bg-primary/10 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                            title={isCollapsed ? item.label : ''}
                        >
                            <item.icon className="w-5 h-5" />
                            {!isCollapsed && <span className="font-medium">{item.label}</span>}
                        </button>
                    ))}

                    <div className="mt-auto pt-2 border-t border-gray-200/30 dark:border-white/10">
                        <button
                            onClick={onToggleSettings}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-primary/10 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-primary w-full ${isCollapsed ? 'justify-center px-2' : ''}`}
                            title={isCollapsed ? 'Settings' : ''}
                        >
                            <Settings className="w-5 h-5" />
                            {!isCollapsed && <span className="font-medium">Settings</span>}
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 p-4 pb-24 md:pb-8 lg:p-8 max-w-5xl mx-auto w-full transition-all duration-300 ${isCollapsed ? 'lg:ml-24' : 'lg:ml-72'}`}>
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full glass-card border-t border-gray-200/50 dark:border-white/10 z-50 rounded-none rounded-t-2xl pb-safe bg-white/80 dark:bg-slate-900/80">
                <div className="flex justify-around items-center p-1.5">
                    {mobileMainItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleMobileNav(item.id)}
                            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all duration-300 min-w-0 flex-1 ${currentPage === item.id
                                ? 'text-primary'
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className={`p-1.5 rounded-full transition-colors ${currentPage === item.id ? 'bg-primary/10' : ''}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                        </button>
                    ))}

                    {/* More button */}
                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all duration-300 min-w-0 flex-1 ${showMoreMenu
                            ? 'text-primary'
                            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                            }`}
                    >
                        <div className={`p-1.5 rounded-full transition-colors ${showMoreMenu ? 'bg-primary/10' : ''}`}>
                            <MoreHorizontal className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-medium leading-tight">Lainnya</span>
                    </button>
                </div>
            </div>

            {/* Mobile More Menu Overlay */}
            <AnimatePresence>
                {showMoreMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMoreMenu(false)}
                            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 80 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 80 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed bottom-16 left-3 right-3 z-50 glass-card p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-2xl border border-gray-200/50 dark:border-white/10"
                        >
                            <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-gray-100 dark:border-white/10">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Menu Lainnya</span>
                                <button onClick={() => setShowMoreMenu(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {mobileOverflowItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleMobileNav(item.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${currentPage === item.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MainLayout;
