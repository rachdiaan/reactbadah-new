import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Bookmark, BookmarkCheck, Share2, Check } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { quranService, Ayah } from '../services/quranService';

interface SurahDetailProps {
    surahNumber: number;
    surahName: string;
    onBack: () => void;
}

interface BookmarkedAyah {
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    text: string;
}

const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ';

function stripBismillah(text: string): string {
    // Strip the Basmala from first ayah — it's already shown in the header
    if (text.startsWith('بِسْمِ')) {
        const parts = text.split(' ');
        // Basmala is 4 words: بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        return parts.slice(4).join(' ').trim();
    }
    return text;
}

function loadBookmarks(): BookmarkedAyah[] {
    try {
        return JSON.parse(localStorage.getItem('quran_bookmarks') || '[]');
    } catch {
        return [];
    }
}

const SurahDetail: React.FC<SurahDetailProps> = ({ surahNumber, surahName, onBack }) => {
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { arabicFontSize, showTranslation, showVerseActions } = useSettings();

    // Audio State
    const [playingAyah, setPlayingAyah] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Bookmark & Share State
    const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>(loadBookmarks);
    const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

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

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [surahNumber]);

    const handlePlayAudio = (ayah: Ayah) => {
        if (playingAyah === ayah.numberInSurah) {
            audioRef.current?.pause();
            setPlayingAyah(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const audio = new Audio(ayah.audio);
            audioRef.current = audio;
            audio.play();
            setPlayingAyah(ayah.numberInSurah);
            audio.onended = () => setPlayingAyah(null);
        }
    };

    const handleBookmark = useCallback((ayah: Ayah) => {
        setBookmarks(prev => {
            const exists = prev.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayah.numberInSurah);
            const next = exists
                ? prev.filter(b => !(b.surahNumber === surahNumber && b.ayahNumber === ayah.numberInSurah))
                : [...prev, { surahNumber, surahName, ayahNumber: ayah.numberInSurah, text: ayah.text }];
            localStorage.setItem('quran_bookmarks', JSON.stringify(next));
            return next;
        });
    }, [surahNumber, surahName]);

    const handleShare = useCallback(async (ayah: Ayah) => {
        const displayText = ayah.numberInSurah === 1 && surahNumber !== 1 && surahNumber !== 9
            ? stripBismillah(ayah.text)
            : ayah.text;
        const shareText = `${displayText}\n\n${ayah.translation}\n\n— ${surahName} : ${ayah.numberInSurah}`;

        if (navigator.share) {
            try {
                await navigator.share({ text: shareText });
            } catch {
                // user cancelled share, do nothing
            }
        } else {
            await navigator.clipboard.writeText(shareText);
            setCopiedAyah(ayah.numberInSurah);
            setTimeout(() => setCopiedAyah(null), 2000);
        }
    }, [surahNumber, surahName]);

    const isBookmarked = (ayah: Ayah) =>
        bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayah.numberInSurah);

    const showsBismillah = surahNumber !== 1 && surahNumber !== 9;

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
                        aria-label="Kembali ke daftar surah"
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
                {showsBismillah && (
                    <div className="hidden md:block">
                        <p className="arabic-text text-xl lg:text-2xl text-primary font-bold" style={{ fontFamily: '"Amiri", serif' }}>
                            {BISMILLAH}
                        </p>
                    </div>
                )}
            </div>

            {/* Bismillah Mobile */}
            {showsBismillah && (
                <div className="md:hidden text-center py-4">
                    <p className="arabic-text text-2xl text-gray-800 dark:text-gray-200" style={{ fontFamily: '"Amiri", serif' }}>
                        {BISMILLAH}
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
                    {ayahs.map((ayah, index) => {
                        const bookmarked = isBookmarked(ayah);
                        const copied = copiedAyah === ayah.numberInSurah;
                        const arabicText = ayah.numberInSurah === 1 && showsBismillah
                            ? stripBismillah(ayah.text)
                            : ayah.text;

                        return (
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
                                                    aria-label={playingAyah === ayah.numberInSurah ? `Pause ayah ${ayah.numberInSurah}` : `Play ayah ${ayah.numberInSurah}`}
                                                    className={`p-2 rounded-xl transition-all duration-300 ${playingAyah === ayah.numberInSurah ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-400 hover:text-primary hover:bg-primary/10'}`}
                                                >
                                                    {playingAyah === ayah.numberInSurah ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                                </button>
                                                <button
                                                    onClick={() => handleBookmark(ayah)}
                                                    aria-label={bookmarked ? `Hapus bookmark ayah ${ayah.numberInSurah}` : `Bookmark ayah ${ayah.numberInSurah}`}
                                                    className={`p-2 rounded-xl transition ${bookmarked ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-primary hover:bg-primary/5'}`}
                                                >
                                                    {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleShare(ayah)}
                                                    aria-label={copied ? 'Disalin!' : `Bagikan ayah ${ayah.numberInSurah}`}
                                                    className={`p-2 rounded-xl transition ${copied ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-gray-400 hover:text-primary hover:bg-primary/5'}`}
                                                >
                                                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
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
                                        {arabicText}
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
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};

export default SurahDetail;
