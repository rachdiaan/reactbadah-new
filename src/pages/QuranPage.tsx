import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, BookOpen, X } from 'lucide-react';
import SurahDetail from '../components/SurahDetail';
import { quranService, SurahMeta } from '../services/quranService';

const REVELATION_LABELS: Record<string, string> = {
    Meccan: 'Makkiyah',
    Medinan: 'Madaniyah',
};

const QuranPage: React.FC = () => {
    const [surahs, setSurahs] = useState<SurahMeta[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<{ number: number; name: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        quranService.getAllSurahs().then(data => {
            setSurahs(data);
            setIsLoading(false);
        });
    }, []);

    const filteredSurahs = useMemo(() =>
        surahs.filter(s =>
            s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.number.toString().includes(searchTerm)
        ),
        [surahs, searchTerm]
    );

    if (selectedSurah) {
        return (
            <SurahDetail
                surahNumber={selectedSurah.number}
                surahName={selectedSurah.name}
                onBack={() => setSelectedSurah(null)}
            />
        );
    }

    return (
        <div className="space-y-5 max-w-4xl mx-auto pb-20">
            {/* ── Header ─────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
            >
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/25 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-[var(--text-main)]">Al-Qur'an</h1>
                    <p className="text-xs text-[var(--text-muted)] font-medium">
                        {isLoading ? 'Memuat...' : `${surahs.length} Surat`}
                    </p>
                </div>
            </motion.div>

            {/* ── Search ─────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 }}
                className="relative"
            >
                <Search className="w-4.5 h-4.5 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    placeholder="Cari nama atau terjemahan surat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-10 py-3.5 rounded-2xl
                        bg-white/80 dark:bg-slate-800/70
                        border border-white/60 dark:border-white/8
                        shadow-sm focus:shadow-glow
                        focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50
                        text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60
                        text-sm font-medium transition-all backdrop-blur-sm"
                />
                <AnimatePresence>
                    {searchTerm && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setSearchTerm('')}
                            aria-label="Hapus pencarian"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-[var(--text-muted)] transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* ── Results count ──────────── */}
            {searchTerm && !isLoading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-[var(--text-muted)] px-1"
                >
                    {filteredSurahs.length} hasil untuk "{searchTerm}"
                </motion.p>
            )}

            {/* ── Surah List ─────────────── */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl shimmer" />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredSurahs.map((surah, idx) => (
                            <motion.button
                                key={surah.number}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(idx * 0.02, 0.3) } }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedSurah({ number: surah.number, name: surah.englishName })}
                                className="group flex items-center gap-4 p-4 rounded-2xl text-left
                                    bg-white/70 dark:bg-slate-800/60
                                    border border-white/60 dark:border-white/6
                                    hover:border-primary/25 hover:shadow-card
                                    backdrop-blur-sm transition-all duration-200"
                            >
                                {/* Number badge */}
                                <div className="w-11 h-11 flex-shrink-0 rounded-xl
                                    bg-gray-50 dark:bg-slate-700/70
                                    group-hover:bg-primary/8 dark:group-hover:bg-primary/15
                                    flex items-center justify-center
                                    text-sm font-bold text-[var(--text-muted)] group-hover:text-primary
                                    transition-colors duration-200 tabular-nums"
                                >
                                    {surah.number}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[var(--text-main)] group-hover:text-primary transition-colors text-base truncate">
                                        {surah.englishName}
                                    </h3>
                                    <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                                        {surah.englishNameTranslation}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-slate-700/60 text-[var(--text-muted)] px-1.5 py-0.5 rounded-md">
                                            {REVELATION_LABELS[surah.revelationType] || surah.revelationType}
                                        </span>
                                        <span className="text-[9px] font-semibold text-[var(--text-muted)]">
                                            {surah.numberOfAyahs} ayat
                                        </span>
                                    </div>
                                </div>

                                {/* Arabic name + arrow */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <p
                                        className="text-xl text-primary font-medium"
                                        dir="rtl"
                                        style={{ fontFamily: '"Scheherazade New","Amiri",serif' }}
                                    >
                                        {surah.name}
                                    </p>
                                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-white/20 group-hover:text-primary/60 transition-colors" />
                                </div>
                            </motion.button>
                        ))}
                    </AnimatePresence>

                    {filteredSurahs.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="md:col-span-2 text-center py-16 text-[var(--text-muted)]"
                        >
                            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">Surat tidak ditemukan</p>
                            <p className="text-xs mt-1">Coba kata kunci lain</p>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default QuranPage;
