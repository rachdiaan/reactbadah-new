import React, { useState } from 'react';
import { Home, Sun, Moon, Info, FileText, Settings, BookOpen, Compass, Ban, ChevronLeft, ChevronRight } from 'lucide-react';
import Logo from '../Logo';

interface MainLayoutProps {
    children: React.ReactNode;
    currentPage: 'home' | 'dzikir-pagi' | 'dzikir-petang' | 'quran' | 'qibla' | 'about' | 'documentation' | 'boycott';
    onNavigate: (page: 'home' | 'dzikir-pagi' | 'dzikir-petang' | 'quran' | 'qibla' | 'about' | 'documentation' | 'boycott') => void;
    onToggleSettings: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    currentPage,
    onNavigate,
    onToggleSettings
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'quran', label: "Al-Qur'an", icon: BookOpen },
        { id: 'qibla', label: 'Kiblat', icon: Compass },
        { id: 'boycott', label: 'Cek Boikot', icon: Ban },
        { id: 'dzikir-pagi', label: 'Pagi', icon: Sun },
        { id: 'dzikir-petang', label: 'Petang', icon: Moon },
    ];

    const secondaryNavItems = [
        { id: 'about', label: 'About', icon: Info },
        { id: 'documentation', label: 'Docs', icon: FileText },
    ];

    return (
        <div className="flex min-h-screen relative text-gray-800 dark:text-gray-100">
            {/* Background is handled globally by body/liquid-bg, but we add a subtle overlay pattern if desired */}

            {/* Desktop Sidebar (Visible on lg screens) */}
            <aside
                className={`hidden lg:flex flex-col h-screen fixed left-0 top-0 glass-card m-4 my-4 rounded-3xl z-40 border-opacity-40 bg-white/60 dark:bg-slate-900/60 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                {/* Header with Toggle */}
                <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-gray-200/30 dark:border-white/10`}>
                    {!isCollapsed && (
                        <Logo />
                    )}
                    {isCollapsed && (
                        <div className="absolute top-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Optional: Show icon on hover or maybe just leave it clean */}
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* Scrollable Nav Area */}
                <nav className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto no-scrollbar">
                    {/* Main Menu */}
                    <div className={`text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-2 mt-2 ${isCollapsed ? 'text-center' : ''}`}>
                        {isCollapsed ? '...' : 'Menu'}
                    </div>

                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as any)}
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

                    {/* Secondary Menu */}
                    <div className={`text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-2 mt-2 ${isCollapsed ? 'text-center' : ''}`}>
                        {isCollapsed ? '...' : 'Info'}
                    </div>

                    {secondaryNavItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as any)}
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
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 p-4 pb-24 md:pb-8 lg:p-8 max-w-5xl mx-auto w-full transition-all duration-300 ${isCollapsed ? 'lg:ml-24' : 'lg:ml-72'}`}>
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full glass-card border-t border-gray-200/50 dark:border-white/10 z-50 rounded-none rounded-t-2xl pb-safe">
                <div className="flex justify-around items-center p-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as any)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${currentPage === item.id
                                ? 'text-primary'
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                                }`}
                        >
                            <div className={`p-2 rounded-full ${currentPage === item.id ? 'bg-primary/10' : ''}`}>
                                <item.icon className={`w-6 h-6 ${currentPage === item.id ? 'fill-current' : ''}`} />
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    ))}

                    <button
                        onClick={onToggleSettings}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <div className="p-2">
                            <Settings className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium">Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
