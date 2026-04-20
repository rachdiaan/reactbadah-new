import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Bookmark, BookmarkCheck, Share2, Check, AlertCircle } from 'lucide-react';
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
    if (text.startsWith('بِسْمِ')) {
        const parts = text.split(' ');
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

// Shimmer skeleton for a single ayah card
const AyahSkeleton: React.FC = () => (
    <div className="p-4 md:p-6 rounded-2xl bg-white/30 dark:bg-white/5 border border-gray-100/50 dark:border-white/5 space-y-4">
        <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full shimmer" />
            <div className="flex gap-2">
                <div className="w-8 h-8 rounded-xl shimmer" />
                <div className="w-8 h-8 rounded-xl shimmer" />
                <div className="w-8 h-8 rounded-xl shimmer" />
            </div>
        </div>
        <div className="space-y-2 flex flex-col items-end">
            <div className="h-6 w-3/4 rounded-lg shimmer" />
            <div className="h-6 w-1/2 rounded-lg shimmer" />
        </div>
        <div className="space-y-1.5 border-t border-gray-100/50 dark:border-white/5 pt-4">
            <div className="h-3 w-full rounded shimmer" />
            <div className="h-3 w-5/6 rounded shimmer" />
        </div>
    </div>
);

const SurahDetail: React.FC<SurahDetailProps> = ({ surahNumber, surahName, onBack }) => {
    const [ayahs, setAyahs] = useState<Ayah[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const { arabicFontSize, showTranslation, showVerseActions } = useSettings();

    const [playingAyah, setPlayingAyah] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [bookmarks, setBookmarks] = useState<BookmarkedAyah[]>(loadBookmarks);
    const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

    const loadSurah = useCallback(async () => {
        setIsLoading(true);
        setHasError(false);
        try {
            const data = await quranService.getSurah(surahNumber);
            if (data) {
                setAyahs(data.ayahs);
            } else {
                setHasError(true);
            }
        } finally {
            setIsLoading(false);
        }
    }, [surahNumber]);

    useEffect(() => {
        loadSurah();
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [loadSurah]);

    const handlePlayAudio = (ayah: Ayah) => {
        if (playingAyah === ayah.numberInSurah) {
            audioRef.current?.pause();
            setPlayingAyah(null);
        } else {
            if (audioRef.current) audioRef.current.pause();
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
            try { await navigator.share({ text: shareText }); } catch { /* cancelled */ }
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
            <div className="flex items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl backdrop-blur-sm border border-white/60 dark:border-white/10 sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        aria-label="Kembali ke daftar surah"
                        className="p-2 hover:bg-primary/10 rounded-full transition-colors text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-main)]">{surahName}</h2>
                        <p className="text-xs text-[var(--text-muted)]">Surat ke-{surahNumber}</p>
                    </div>
                </div>

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
                    <p className="arabic-text text-2xl text-[var(--text-main)]" style={{ fontFamily: '"Amiri", serif' }}>
                        {BISMILLAH}
                    </p>
                </div>
            )}

            {/* Error state */}
            {hasError && !isLoading && (
                <div className="glass-card p-8 flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                    <p className="font-semibold text-[var(--text-main)]">Gagal memuat surah</p>
                    <p className="text-sm text-[var(--text-muted)]">Periksa koneksi internet, lalu coba lagi.</p>
                    <button
                        onClick={loadSurah}
                        className="mt-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                        Coba Lagi
                    </button>
                </div>
            )}

            {/* Skeleton loading */}
            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <AyahSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Ayah list */}
            {!isLoading && !hasError && (
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
                                className={`p-4 md:p-6 rounded-2xl transition-colors border border-gray-100/50 dark:border-white/5
                                    ${index % 2 === 0 ? 'bg-white/30 dark:bg-white/5' : 'bg-white/10 dark:bg-transparent'}
                                    ${playingAyah === ayah.numberInSurah ? 'ring-2 ring-primary/50 bg-primary/5 dark:bg-primary/10' : 'hover:bg-white/40 dark:hover:bg-white/5'}`}
                            >
                                {/* Top bar */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-full font-mono text-xs font-bold transition-colors
                                        ${playingAyah === ayah.numberInSurah ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-primary/10 text-primary'}`}>
                                        {ayah.numberInSurah}
                                    </span>

                                    {showVerseActions && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePlayAudio(ayah)}
                                                aria-label={playingAyah === ayah.numberInSurah ? `Pause ayah ${ayah.numberInSurah}` : `Play ayah ${ayah.numberInSurah}`}
                                                className={`p-2 rounded-xl transition-all duration-300
                                                    ${playingAyah === ayah.numberInSurah
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                        : 'text-[var(--text-muted)] hover:text-primary hover:bg-primary/10'}`}
                                            >
                                                {playingAyah === ayah.numberInSurah
                                                    ? <Pause className="w-4 h-4 fill-current" />
                                                    : <Play className="w-4 h-4 fill-current" />}
                                            </button>
                                            <button
                                                onClick={() => handleBookmark(ayah)}
                                                aria-label={bookmarked ? `Hapus bookmark ayah ${ayah.numberInSurah}` : `Bookmark ayah ${ayah.numberInSurah}`}
                                                className={`p-2 rounded-xl transition
                                                    ${bookmarked ? 'text-primary bg-primary/10' : 'text-[var(--text-muted)] hover:text-primary hover:bg-primary/5'}`}
                                            >
                                                {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleShare(ayah)}
                                                aria-label={copied ? 'Disalin!' : `Bagikan ayah ${ayah.numberInSurah}`}
                                                className={`p-2 rounded-xl transition
                                                    ${copied ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-[var(--text-muted)] hover:text-primary hover:bg-primary/5'}`}
                                            >
                                                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Arabic text */}
                                <div className="text-right mb-6 w-full px-2">
                                    <p
                                        className="leading-[2.5] text-[var(--text-main)]"
                                        dir="rtl"
                                        style={{ fontFamily: '"Amiri", serif', fontSize: `${arabicFontSize}px` }}
                                    >
                                        {arabicText}
                                    </p>
                                </div>

                                {/* Translation */}
                                {showTranslation && (
                                    <div className="text-left px-2 border-t border-gray-100 dark:border-white/5 pt-4">
                                        <p className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base font-medium">
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
