import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import SurahDetail from '../components/SurahDetail';

import { quranService, SurahMeta } from '../services/quranService';

const QuranPage: React.FC = () => {
    const [surahs, setSurahs] = useState<SurahMeta[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<{ number: number; name: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSurahs = async () => {
            setIsLoading(true);
            const data = await quranService.getAllSurahs();
            setSurahs(data);
            setIsLoading(false);
        };

        fetchSurahs();
    }, []);

    const filteredSurahs = surahs.filter(surah =>
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        surah.number.toString().includes(searchTerm)
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
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            {/* Search Bar - Full Width Top */}
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Cari surat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-200 placeholder:text-gray-400"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Header Section */}
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Daftar Surat</h2>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                    {surahs.length} surat
                </span>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSurahs.map((surah) => (
                        <motion.div
                            key={surah.number}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -2, shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
                            onClick={() => setSelectedSurah({ number: surah.number, name: surah.englishName })}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer border border-gray-100/80 dark:border-white/5 hover:border-primary/20 transition-all group"
                        >
                            {/* Number Badge */}
                            <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                {surah.number}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate group-hover:text-primary transition-colors">
                                    {surah.englishName}
                                </h3>
                                <p className="text-xs text-gray-400 font-medium uppercase mt-1 tracking-wide">
                                    {surah.revelationType.toUpperCase()} • {surah.numberOfAyahs} AYAT
                                </p>
                            </div>

                            {/* Arabic Name & Arrow */}
                            <div className="flex items-center gap-4">
                                <p className="font-serif text-xl text-primary font-medium" dir="rtl" style={{ fontFamily: '"Amiri", serif' }}>
                                    {surah.name}
                                </p>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary/50 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuranPage;
