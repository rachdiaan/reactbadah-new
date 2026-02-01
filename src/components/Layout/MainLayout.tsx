import React from 'react';
import { Home, Sun, Moon, Info, FileText, Settings, BookOpen, Compass } from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
    currentPage: 'home' | 'dzikir-pagi' | 'dzikir-petang' | 'quran' | 'qibla' | 'about' | 'documentation';
    onNavigate: (page: 'home' | 'dzikir-pagi' | 'dzikir-petang' | 'quran' | 'qibla' | 'about' | 'documentation') => void;
    onToggleSettings: () => void; // To open the Settings/ControlPanel
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    currentPage,
    onNavigate,
    onToggleSettings
}) => {

    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'quran', label: "Al-Qur'an", icon: BookOpen },
        { id: 'qibla', label: 'Kiblat', icon: Compass },
        { id: 'dzikir-pagi', label: 'Pagi', icon: Sun },
        { id: 'dzikir-petang', label: 'Petang', icon: Moon },
    ];

    const secondaryNavItems = [
        { id: 'about', label: 'About', icon: Info },
        { id: 'documentation', label: 'Docs', icon: FileText },
    ];

    return (
        <div className="flex min-h-screen relative text-gray-800">
            {/* Background is handled globally by body/liquid-bg, but we add a subtle overlay pattern if desired */}

            {/* Desktop Sidebar (Visible on lg screens) */}
            <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 glass-card m-4 my-4 rounded-3xl z-40 border-opacity-40 bg-white/60">
                <div className="p-8 flex items-center justify-center border-b border-gray-200/30">
                    <h1 className="font-serif text-2xl font-bold text-primary">Al-Matsurat</h1>
                </div>

                <nav className="flex-1 flex flex-col gap-2 p-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Menu</div>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as any)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentPage === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'hover:bg-primary/10 text-gray-600 hover:text-primary'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}

                    <div className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Info</div>
                    {secondaryNavItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as any)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentPage === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'hover:bg-primary/10 text-gray-600 hover:text-primary'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200/30">
                    <button
                        onClick={onToggleSettings}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-all w-full text-gray-600"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 p-4 pb-24 md:pb-8 lg:p-8 max-w-5xl mx-auto w-full">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 w-full glass-card border-t border-gray-200/50 z-50 rounded-none rounded-t-2xl pb-safe">
                <div className="flex justify-around items-center p-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id as any)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${currentPage === item.id
                                ? 'text-primary'
                                : 'text-gray-400 hover:text-gray-600'
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
                        className="flex flex-col items-center gap-1 p-2 rounded-xl text-gray-400 hover:text-gray-600"
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
