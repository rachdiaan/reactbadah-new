import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, FileText, Bell, Settings, X, Moon, Sun, Eye, EyeOff, Play, MapPin } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface ControlPanelProps {
    isVisible: boolean;
    onToggle: () => void;
    onNavigate: (page: 'home' | 'about' | 'documentation') => void;
    onTriggerAlert: () => void;
    currentMethod?: string;
    onMethodChange?: (methodId: string) => void;
    availableMethods?: { id: string; name: string }[];
    locationName?: string;
}

const Toggle: React.FC<{ on: boolean; onChange: () => void; label: string }> = ({ on, onChange, label }) => (
    <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-250 flex-shrink-0 ${on ? 'bg-primary' : 'bg-gray-200 dark:bg-slate-600'}`}
    >
        <motion.div
            animate={{ x: on ? 22 : 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
    </button>
);

const ControlPanel: React.FC<ControlPanelProps> = ({
    isVisible, onToggle, onNavigate, onTriggerAlert,
    currentMethod, onMethodChange, availableMethods = [], locationName,
}) => {
    const [activeTab, setActiveTab] = React.useState<'general' | 'settings'>('general');
    const { isDarkMode, toggleDarkMode, showTranslation, toggleTranslation, showVerseActions, toggleVerseActions, arabicFontSize, setArabicFontSize } = useSettings();

    return (
        <>
            {/* Floating toggle button (desktop) */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={onToggle}
                aria-label={isVisible ? 'Tutup pengaturan' : 'Buka pengaturan'}
                className="hidden lg:flex fixed bottom-5 right-5 z-50 w-12 h-12 rounded-2xl items-center justify-center
                    bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
                    border border-white/60 dark:border-white/10
                    shadow-lg shadow-black/8 hover:shadow-glow
                    text-primary transition-all"
            >
                <AnimatePresence mode="wait">
                    {isVisible
                        ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-5 h-5" /></motion.div>
                        : <motion.div key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Settings className="w-5 h-5" /></motion.div>
                    }
                </AnimatePresence>
            </motion.button>

            {/* Panel */}
            <AnimatePresence>
                {isVisible && (
                    <>
                        {/* Backdrop (mobile) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onToggle}
                            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                            className="fixed bottom-20 right-3 lg:bottom-20 lg:right-20 z-50 w-72 max-h-[80vh] overflow-y-auto no-scrollbar
                                rounded-2xl bg-white/95 dark:bg-slate-900/96 backdrop-blur-2xl
                                border border-white/70 dark:border-white/10
                                shadow-xl shadow-black/12"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 pt-4 pb-2">
                                <h3 className="text-sm font-bold text-[var(--text-main)]">Pengaturan</h3>
                                <button onClick={onToggle} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 text-[var(--text-muted)] transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="px-3 pb-2">
                                <div className="flex gap-1 bg-gray-100/80 dark:bg-white/6 p-1 rounded-xl">
                                    {(['general', 'settings'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                                        >
                                            {tab === 'general' ? 'Navigasi' : 'Tampilan'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="px-3 pb-4">
                                {activeTab === 'general' ? (
                                    <div className="space-y-1">
                                        {/* Nav shortcuts */}
                                        {[
                                            { page: 'home'          as const, label: 'Home',           icon: Home },
                                            { page: 'about'         as const, label: 'Tentang',         icon: Info },
                                            { page: 'documentation' as const, label: 'Dokumentasi',     icon: FileText },
                                        ].map(({ page, label, icon: Icon }) => (
                                            <button
                                                key={page}
                                                onClick={() => onNavigate(page)}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-primary/6 dark:hover:bg-white/6 transition text-[var(--text-main)] text-sm font-medium"
                                            >
                                                <Icon className="w-4 h-4 text-primary" />
                                                {label}
                                            </button>
                                        ))}

                                        <button
                                            onClick={onTriggerAlert}
                                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-primary/6 dark:hover:bg-white/6 transition text-[var(--text-main)] text-sm font-medium"
                                        >
                                            <Bell className="w-4 h-4 text-primary" />
                                            Test Notifikasi
                                        </button>

                                        {/* Prayer method */}
                                        {onMethodChange && availableMethods.length > 0 && (
                                            <div className="pt-3 mt-2 border-t border-gray-100 dark:border-white/8">
                                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.18em] mb-2 px-1">
                                                    Metode Perhitungan
                                                </p>
                                                <select
                                                    value={currentMethod}
                                                    onChange={(e) => onMethodChange(e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-slate-800 text-[var(--text-main)] text-xs rounded-xl px-3 py-2.5 border border-gray-200 dark:border-slate-600 focus:outline-none focus:border-primary"
                                                >
                                                    {availableMethods.map(m => (
                                                        <option key={m.id} value={m.id}>{m.name}</option>
                                                    ))}
                                                </select>
                                                {locationName && (
                                                    <div className="flex items-center gap-1.5 mt-2 px-1 text-[10px] text-[var(--text-muted)]">
                                                        <MapPin className="w-3 h-3" />
                                                        {locationName}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Dark mode */}
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-white/4">
                                            <div className="flex items-center gap-2.5">
                                                {isDarkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-500" />}
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--text-main)]">Mode Gelap</p>
                                                </div>
                                            </div>
                                            <Toggle on={isDarkMode} onChange={toggleDarkMode} label="Toggle mode gelap" />
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.18em]">Konten</p>

                                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-white/4">
                                                <div className="flex items-center gap-2.5">
                                                    {showTranslation ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4 text-[var(--text-muted)]" />}
                                                    <div>
                                                        <p className="text-sm font-semibold text-[var(--text-main)]">Terjemahan</p>
                                                        <p className="text-[10px] text-[var(--text-muted)]">Tampilkan arti ayat</p>
                                                    </div>
                                                </div>
                                                <Toggle on={showTranslation} onChange={toggleTranslation} label="Toggle terjemahan" />
                                            </div>

                                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-white/4">
                                                <div className="flex items-center gap-2.5">
                                                    <Play className="w-4 h-4 text-primary" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-[var(--text-main)]">Tombol Aksi</p>
                                                        <p className="text-[10px] text-[var(--text-muted)]">Play, Bookmark, Share</p>
                                                    </div>
                                                </div>
                                                <Toggle on={showVerseActions} onChange={toggleVerseActions} label="Toggle tombol aksi" />
                                            </div>
                                        </div>

                                        {/* Font size */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.18em]">Ukuran Teks Arab</p>
                                                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-lg">{arabicFontSize}px</span>
                                            </div>
                                            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700 mb-3 text-right overflow-hidden">
                                                <p style={{ fontFamily: '"Scheherazade New","Amiri",serif', fontSize: `${arabicFontSize}px`, lineHeight: 2 }}
                                                    dir="rtl" className="text-[var(--text-main)]">
                                                    بِسْمِ اللَّهِ
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 px-1">
                                                <span className="text-xs text-[var(--text-muted)]">A</span>
                                                <input
                                                    type="range" min="18" max="60" step="2"
                                                    value={arabicFontSize}
                                                    onChange={(e) => setArabicFontSize(Number(e.target.value))}
                                                    className="flex-1 h-1.5 rounded-full accent-primary cursor-pointer"
                                                />
                                                <span className="text-sm font-bold text-[var(--text-muted)]">A</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default ControlPanel;
