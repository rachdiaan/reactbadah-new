import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';
import { DzikirItem } from '../types';
import { useGeminiAI } from '../hooks/useGeminiAI';
import { useSettings } from '../hooks/useSettings';

interface DzikirCardProps {
    dzikir: DzikirItem;
    onTadabbur: (content: string) => void;
}

const DzikirCard: React.FC<DzikirCardProps> = ({ dzikir, onTadabbur }) => {
    const [currentTaps, setCurrentTaps] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [tapAnim, setTapAnim] = useState(false);
    const { getTadabbur, isLoading } = useGeminiAI();
    const { arabicFontSize, showTranslation } = useSettings();

    const handleTap = useCallback(() => {
        if (isCompleted) return;
        const next = currentTaps + 1;
        setCurrentTaps(next);
        setTapAnim(true);
        setTimeout(() => setTapAnim(false), 300);
        if (next >= dzikir.total_taps) setIsCompleted(true);
    }, [currentTaps, isCompleted, dzikir.total_taps]);

    const handleReset = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentTaps(0);
        setIsCompleted(false);
    }, []);

    const handleTadabbur = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        const items = dzikir.verses || dzikir.content || [];
        const arabic = items.map(i => i.arabic).join(' ');
        const trans  = items.map(i => i.translation_id).join(' ');
        const result = await getTadabbur(arabic, trans);
        onTadabbur(result);
    }, [dzikir, getTadabbur, onTadabbur]);

    const progress = Math.min(1, currentTaps / dzikir.total_taps);
    const items    = dzikir.verses || dzikir.content || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden transition-all duration-300 ${isCompleted ? 'border-primary/40 shadow-glow' : ''}`}
        >
            {/* ── Completion stripe ─── */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="h-1 bg-gradient-to-r from-primary to-accent origin-left"
                    />
                )}
            </AnimatePresence>

            <div className="p-5 md:p-6">
                {/* ── Header Row ─────── */}
                <div className="flex justify-between items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base md:text-lg font-bold text-[var(--text-main)]">
                                {dzikir.title}
                            </h2>
                            <AnimatePresence>
                                {isCompleted && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="badge-selesai inline-flex items-center gap-1 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full"
                                    >
                                        <CheckCircle2 className="w-3 h-3" />
                                        Selesai
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                        {dzikir.subtitle_ar && (
                            <p
                                className="text-right text-[var(--text-muted)] mt-2 leading-loose"
                                dir="rtl"
                                style={{ fontFamily: '"Scheherazade New","Amiri",serif', fontSize: `${arabicFontSize * 0.75}px` }}
                            >
                                {dzikir.subtitle_ar}
                            </p>
                        )}
                        {dzikir.translation && (
                            <p className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-wide font-medium">
                                {dzikir.translation}
                            </p>
                        )}
                    </div>

                    {/* Tadabbur button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTadabbur}
                        disabled={isLoading}
                        aria-label="Tadabbur dengan AI"
                        className="flex-shrink-0 flex items-center gap-1.5 bg-accent/15 text-xs font-bold py-2 px-3.5 rounded-xl hover:bg-accent/25 transition-colors border border-accent/25 text-amber-600 dark:text-amber-400 disabled:opacity-50"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isLoading ? '...' : 'Tadabbur'}
                    </motion.button>
                </div>

                {/* ── Content ────────── */}
                <div className="space-y-5">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="pt-4 border-t border-gray-100/60 dark:border-white/6 first:border-t-0 first:pt-0"
                        >
                            {item.ayat_number !== undefined && (
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md">
                                        Ayat {item.ayat_number}
                                    </span>
                                    {(item as { title_extra?: string }).title_extra && (
                                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                                            {(item as { title_extra?: string }).title_extra}
                                        </span>
                                    )}
                                </div>
                            )}

                            <p
                                className="text-right leading-loose text-[var(--text-main)] mb-3"
                                dir="rtl"
                                style={{ fontFamily: '"Scheherazade New","Amiri",serif', fontSize: `${arabicFontSize}px` }}
                            >
                                {item.arabic}
                            </p>

                            <p className="text-xs md:text-sm italic text-primary/75 dark:text-primary/55 font-medium leading-relaxed mb-1.5">
                                {item.latin}
                            </p>

                            {showTranslation && (
                                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                                    {item.translation_id}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Counter + Progress ─ */}
                <div className="mt-6 pt-5 border-t border-gray-100/60 dark:border-white/8">
                    <div className="flex items-center gap-4">
                        {/* Big tap button */}
                        <div className="relative flex-shrink-0">
                            <motion.button
                                onClick={handleTap}
                                disabled={isCompleted}
                                aria-label={`Hitung dzikir, ${currentTaps} dari ${dzikir.total_taps}`}
                                whileTap={isCompleted ? {} : { scale: 0.88 }}
                                className={`relative w-20 h-20 rounded-full font-bold text-xl tabular-nums shadow-lg transition-all duration-200 select-none overflow-hidden
                                    ${isCompleted
                                        ? 'bg-primary text-white cursor-default shadow-glow'
                                        : 'bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary active:shadow-inner cursor-pointer'
                                    }`}
                            >
                                {/* Ripple fill */}
                                <AnimatePresence>
                                    {tapAnim && (
                                        <motion.div
                                            key={currentTaps}
                                            initial={{ scale: 0, opacity: 0.5 }}
                                            animate={{ scale: 2.5, opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 rounded-full bg-primary"
                                        />
                                    )}
                                </AnimatePresence>

                                <span className="relative z-10">
                                    {isCompleted
                                        ? <CheckCircle2 className="w-7 h-7 text-white mx-auto" />
                                        : currentTaps
                                    }
                                </span>
                            </motion.button>
                        </div>

                        {/* Progress block */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-2 text-xs font-semibold text-[var(--text-muted)]">
                                <span>Progress</span>
                                <span className="font-bold text-primary tabular-nums">{currentTaps} / {dzikir.total_taps}</span>
                            </div>
                            <div className="h-2.5 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700/60">
                                <motion.div
                                    animate={{ width: `${progress * 100}%` }}
                                    transition={{ duration: 0.25 }}
                                    className={`h-full rounded-full transition-colors duration-500 ${
                                        isCompleted
                                            ? 'bg-gradient-to-r from-primary to-accent'
                                            : 'bg-primary/70'
                                    }`}
                                />
                            </div>

                            {/* Reset */}
                            {currentTaps > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleReset}
                                    aria-label="Reset counter dzikir"
                                    className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)] hover:text-primary transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DzikirCard;
