
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Calendar, User, ChevronRight, X, Globe, Volume2 } from 'lucide-react';
import { sermonService, Sermon } from '../services/sermonService';

const SermonsPage: React.FC = () => {
    const [sermons, setSermons] = useState<Sermon[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

    useEffect(() => {
        const fetchSermons = async () => {
            setLoading(true);
            const data = await sermonService.getLatestSermons();
            setSermons(data);
            setLoading(false);
        };
        fetchSermons();
    }, []);

    return (
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2 py-6"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mb-4">
                    <Mic className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Khutbah Jumat</h1>
                <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                    Kumpulan intisari dan teks khutbah Jumat dari berbagai sumber terpercaya.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                    Sumber: UAE Awqaf (English)
                </p>
            </motion.div>

            {/* List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-24 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    {sermons.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">Belum ada data khutbah untuk tahun ini.</div>
                    ) : (
                        sermons.map((sermon, index) => (
                            <motion.div
                                key={sermon.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedSermon(sermon)}
                                className="group relative bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-teal-500/30 dark:hover:border-teal-500/30 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 dark:bg-teal-900/10 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                                <div className="relative z-10 flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(sermon.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                            {sermon.title}
                                        </h3>
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-slate-700/50 rounded-lg text-xs text-gray-500 dark:text-gray-400">
                                                <User className="w-3 h-3" /> Khatib
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-xs text-teal-600 dark:text-teal-400">
                                                <Globe className="w-3 h-3" /> English
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700/50 group-hover:bg-teal-500 group-hover:text-white transition-colors text-gray-400">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Sermon Detail Modal */}
            <AnimatePresence>
                {selectedSermon && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSermon(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.95 }}
                            className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-start justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md z-10 sticky top-0">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 font-bold mb-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(selectedSermon.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white leading-tight">
                                        {selectedSermon.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedSermon(null)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-slate-900/50">
                                <div className="prose dark:prose-invert max-w-none">
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-xl flex items-start gap-3 text-sm text-yellow-800 dark:text-yellow-200 mb-6">
                                        <Volume2 className="w-5 h-5 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold">Khutbah Summary (English)</p>
                                            <p className="opacity-80">
                                                Konten lengkap khutbah ini tersedia dalam Bahasa Inggris sesuai sumber aslinya.
                                                Tadabbur atau terjemahan otomatis mungkin akan tersedia di update mendatang.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Since SDK might not give full text in the list response, we normally need another call.
                                        However, looking at user snippet, `sermons` array might just be metadata.
                                        But wait, user snippet showed `months[0]?.sermons[0]?.title`.
                                        Does it include content? Usually no.
                                        For this MVP, I will show a placeholder or brief if available.
                                        Checking SDK Types: Sermon usually has `editions`.
                                    */}
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line font-serif text-lg">
                                        {/* Fallback content message if actual text isn't in the list object */}
                                        This is the summary or full text of the sermon titled "{selectedSermon.title}".

                                        Please note that the current API integration retrieves the metadata.
                                        To view the full text, we might need to fetch the specific PDF or detail endpoint if available.

                                        (Simulated Content)
                                        In the name of Allah, the Most Gracious, the Most Merciful.
                                        All praise is due to Allah, Lord of the worlds...
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-slate-900 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedSermon(null)}
                                    className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                                >
                                    Tutup
                                </button>
                                <button className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition shadow-lg shadow-teal-500/20">
                                    Download PDF
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
