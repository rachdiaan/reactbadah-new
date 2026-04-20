import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Calendar, ChevronRight, X, Globe, Volume2, Share2, Check, AlertCircle } from 'lucide-react';
import { sermonService, Sermon } from '../services/sermonService';

const SermonsPage: React.FC = () => {
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
    const [copied, setCopied] = useState(false);

    const fetchSermons = async () => {
        setLoading(true);
        setHasError(false);
        const data = await sermonService.getLatestSermons();
        if (data.length === 0) setHasError(false); // empty is valid
        setSermons(data);
        setLoading(false);
    };

    useEffect(() => { fetchSermons(); }, []);

    const handleShare = async (sermon: Sermon) => {
        const text = `${sermon.title}\n${new Date(sermon.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\nSumber: ${sermon.source}`;
        if (navigator.share) {
            try { await navigator.share({ title: sermon.title, text }); } catch { /* cancelled */ }
        } else {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2 py-4"
            >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/15 mb-3">
                    <Mic className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--text-main)]">Khutbah Jumat</h1>
                <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">
                    Kumpulan khutbah Jumat dari sumber terpercaya.
                </p>
                <p className="text-[11px] text-[var(--text-muted)]/60 italic">Sumber: UAE Awqaf (English)</p>
            </motion.div>

            {/* Skeleton */}
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="h-24 rounded-2xl shimmer" />
                    ))}
                </div>
            )}

            {/* Error */}
            {!loading && hasError && (
                <div className="glass-card p-8 flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-9 h-9 text-red-400" />
                    <p className="font-semibold text-[var(--text-main)]">Gagal memuat khutbah</p>
                    <button
                        onClick={fetchSermons}
                        className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* Empty */}
            {!loading && !hasError && sermons.length === 0 && (
                <div className="glass-card p-10 text-center">
                    <Mic className="w-10 h-10 text-[var(--text-muted)]/30 mx-auto mb-3" />
                    <p className="text-[var(--text-muted)] font-medium">Belum ada khutbah untuk tahun ini.</p>
                </div>
            )}

            {/* List */}
            {!loading && !hasError && sermons.length > 0 && (
                <div className="space-y-3">
                    {sermons.map((sermon, index) => (
                        <motion.button
                            key={sermon.id || index}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index * 0.04, 0.3) }}
                            onClick={() => setSelectedSermon(sermon)}
                            className="group glass-card w-full p-5 text-left hover:border-primary/25 transition-all"
                        >
                            <div className="flex justify-between items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                        {new Date(sermon.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <h3 className="font-bold text-[var(--text-main)] group-hover:text-primary transition-colors truncate">
                                        {sermon.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/8 dark:bg-primary/15 text-[10px] font-bold text-primary">
                                            <Globe className="w-3 h-3" /> English
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-primary transition-colors flex-shrink-0" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedSermon && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSermon(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 60, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                            onClick={e => e.stopPropagation()}
                            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col
                                rounded-3xl overflow-hidden
                                bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl
                                border border-white/70 dark:border-white/10
                                shadow-2xl shadow-black/20"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-white/8 flex items-start justify-between flex-shrink-0">
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-1.5 text-xs text-primary font-bold mb-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(selectedSermon.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <h2 className="text-lg font-bold text-[var(--text-main)] leading-snug">
                                        {selectedSermon.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedSermon(null)}
                                    aria-label="Tutup"
                                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 text-[var(--text-muted)] transition-colors flex-shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 bg-gray-50/40 dark:bg-slate-900/40">
                                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-start gap-3">
                                    <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Khutbah Summary (English)</p>
                                        <p className="text-xs text-amber-700/80 dark:text-amber-400/70 mt-0.5">
                                            Konten ini tersedia dalam Bahasa Inggris sesuai sumber aslinya.
                                        </p>
                                    </div>
                                </div>

                                <div className="glass-card p-4">
                                    <p className="text-sm font-bold text-[var(--text-main)] mb-1">{selectedSermon.title}</p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {new Date(selectedSermon.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>

                                <div className="p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/10">
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                        Khutbah ini bersumber dari UAE Awqaf. Untuk konten lengkap, silakan kunjungi sumber resmi atau hubungi pengurus masjid terdekat.
                                    </p>
                                </div>

                                {selectedSermon.source && (
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] px-1">
                                        <Globe className="w-3.5 h-3.5" />
                                        Sumber: {selectedSermon.source}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-gray-100 dark:border-white/8 flex justify-end gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setSelectedSermon(null)}
                                    className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-[var(--text-main)] text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                                >
                                    Tutup
                                </button>
                                <button
                                    onClick={() => handleShare(selectedSermon)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                    {copied ? 'Disalin!' : 'Bagikan'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SermonsPage;
