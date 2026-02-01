import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search } from 'lucide-react';
import SurahDetail from '../components/SurahDetail';

interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
}

const QuranPage: React.FC = () => {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [selectedSurah, setSelectedSurah] = useState<{ number: number; name: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                // Using direct API fetch as it's cleaner for client-side usage than some heavy SDKs
                // The Islamic Network SDK wraps this API: http://api.alquran.cloud/v1/surah
                const response = await fetch('https://api.alquran.cloud/v1/surah');
                const data = await response.json();
                if (data.code === 200) {
                    setSurahs(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch Surahs:", error);
            } finally {
                setIsLoading(false);
            }
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
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                        <BookOpen className="w-8 h-8" />
                        Al-Qur'an
                    </h1>
                    <p className="text-gray-600 mt-1">Daftar Surat dan Terjemahan</p>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Cari Surat..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white/80 backdrop-blur-sm"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSurahs.map((surah) => (
                        <motion.div
                            key={surah.number}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            onClick={() => setSelectedSurah({ number: surah.number, name: surah.englishName })}
                            className="glass-card p-4 relative overflow-hidden group hover:border-primary/30 cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BookOpen className="w-16 h-16 text-primary" />
                            </div>

                            <div className="flex items-start gap-4 z-10 relative">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-mono">
                                    {surah.number}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors">
                                        {surah.englishName}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-2">{surah.englishNameTranslation}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span className={`px-2 py-0.5 rounded-full ${surah.revelationType === 'Meccan' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                            {surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}
                                        </span>
                                        <span>• {surah.numberOfAyahs} Ayat</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="arabic-text text-3xl text-gray-800 mt-1 mb-1 font-bold" style={{ lineHeight: 1.6 }}>{surah.name}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuranPage;
