import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Bookmark, Share2 } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { quranService, Ayah } from '../services/quranService';

interface SurahDetailProps {
    surahNumber: number;
    surahName: string;
    onBack: () => void;
}

const SurahDetail: React.FC<SurahDetailProps> = ({ surahNumber, surahName, onBack }) => {
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { arabicFontSize, showTranslation, showVerseActions } = useSettings();

    // Audio State
    const [playingAyah, setPlayingAyah] = useState<number | null>(null); // Ayah Number in Surah
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchSurahDetails = async () => {
            setIsLoading(true);
            const data = await quranService.getSurah(surahNumber);
            if (data) {
                setAyahs(data.ayahs);
            }
            setIsLoading(false);
        };

        fetchSurahDetails();

        // Cleanup audio on unmount or surah change
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [surahNumber]);

    const handlePlayAudio = (ayah: Ayah) => {
        if (playingAyah === ayah.numberInSurah) {
            // Pause
            audioRef.current?.pause();
            setPlayingAyah(null);
        } else {
            // Stop previous
            if (audioRef.current) {
                audioRef.current.pause();
            }
            // Play new
            const audio = new Audio(ayah.audio);
            audioRef.current = audio;
            audio.play();
            setPlayingAyah(ayah.numberInSurah);

            // Auto-play next (Optional but nice)
            audio.onended = () => {
                setPlayingAyah(null);
                // Logic for next ayah could go here if requested
            };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 pb-20"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl backdrop-blur-sm border border-white/60 dark:border-white/10 sticky top-0 z-20 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{surahName}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Surat ke-{surahNumber}</p>
                    </div>
                </div>

                {/* Bismillah Desktop */}
                {surahNumber !== 1 && surahNumber !== 9 && (
                    <div className="hidden md:block">
                        <p className="arabic-text text-xl lg:text-2xl text-primary font-bold" style={{ fontFamily: '"Amiri", serif' }}>
                            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                        </p>
                    </div>
                )}
            </div>

            {/* Bismillah Mobile */}
            {surahNumber !== 1 && surahNumber !== 9 && (
                <div className="md:hidden text-center py-4">
                    <p className="arabic-text text-2xl text-gray-800 dark:text-gray-200" style={{ fontFamily: '"Amiri", serif' }}>
                        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                    </p>
                </div>
            )}

            {/* Ayah List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {ayahs.map((ayah, index) => (
                        <div
                            key={ayah.number}
                            className={`p-4 md:p-6 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors border border-gray-100/50 dark:border-white/5 ${index % 2 === 0 ? 'bg-white/30 dark:bg-white/5' : 'bg-white/10 dark:bg-transparent'} ${playingAyah === ayah.numberInSurah ? 'ring-2 ring-primary/50 bg-primary/5 dark:bg-primary/10' : ''}`}
                        >
                            {/* Top Bar: Number & Actions */}
                            <div className="flex justify-between items-start mb-4">
                                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${playingAyah === ayah.numberInSurah ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-primary/10 text-primary'}`}>
                                    {ayah.numberInSurah}
                                </span>

                                <div className="flex gap-2">
                                    {showVerseActions && (
                                        <>
                                            <button
                                                onClick={() => handlePlayAudio(ayah)}
                                                className={`p-2 rounded-xl transition-all duration-300 ${playingAyah === ayah.numberInSurah ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:text-primary hover:bg-primary/10'}`}
                                                title={playingAyah === ayah.numberInSurah ? "Pause" : "Play Audio"}
                                            >
                                                {playingAyah === ayah.numberInSurah ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition" title="Bookmark">
                                                <Bookmark className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition" title="Share">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Arabic Text */}
                            <div className="text-right mb-6 w-full px-2">
                                <p
                                    className="leading-[2.5] text-gray-800 dark:text-gray-100"
                                    dir="rtl"
                                    style={{
                                        fontFamily: '"Amiri", serif',
                                        fontSize: `${arabicFontSize}px`
                                    }}
                                >
                                    {ayah.text}
                                </p>
                            </div>

                            {/* Translation */}
                            {showTranslation && (
                                <div className="text-left px-2 border-t border-gray-100 dark:border-white/5 pt-4">
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                                        {ayah.translation}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default SurahDetail;
