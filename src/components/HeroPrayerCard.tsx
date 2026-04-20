import React, { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useGeminiAI } from '../hooks/useGeminiAI';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const PRAYER_ORDER = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'] as const;

const HeroPrayerCard: React.FC = () => {
    const {
        currentTime,
        nextPrayer,
        countdown,
        todayPrayers,
        locationName,
        isLoading: isTimeLoading,
        error: timeError,
        retry,
    } = usePrayerTimes();

    const { getDailyWisdom, isLoading: isWisdomLoading } = useGeminiAI();
    const [wisdom, setWisdom] = useState<string>('');
    const [wisdomFetched, setWisdomFetched] = useState(false);

    const handleGetWisdom = useCallback(async () => {
        const result = await getDailyWisdom(nextPrayer?.name);
        setWisdom(result);
        setWisdomFetched(true);
    }, [getDailyWisdom, nextPrayer?.name]);

    const formatCountdown = () =>
        `${String(countdown.hours).padStart(2, '0')}:${String(countdown.minutes).padStart(2, '0')}:${String(countdown.seconds).padStart(2, '0')}`;

    // Compute progress towards next prayer (0–1)
    const getProgress = () => {
        if (!nextPrayer || !todayPrayers) return 0;
        const sorted = PRAYER_ORDER
            .map(k => todayPrayers[k])
            .filter(Boolean)
            .sort((a, b) => a.time.getTime() - b.time.getTime());
        const nextIdx = sorted.findIndex(p => p.key === nextPrayer.key);
        const prevPrayer = nextIdx > 0 ? sorted[nextIdx - 1] : sorted[sorted.length - 1];
        if (!prevPrayer) return 0;
        const total = nextPrayer.time.getTime() - prevPrayer.time.getTime();
        const elapsed = currentTime.getTime() - prevPrayer.time.getTime();
        return Math.min(1, Math.max(0, elapsed / total));
    };

    const progress = getProgress();

    if (timeError) {
        return (
            <div className="glass-card w-full p-8 mb-6 flex flex-col items-center justify-center gap-3 text-center bg-red-50/50 dark:bg-red-900/10">
                <RefreshCw className="w-6 h-6 text-red-400" />
                <p className="font-medium text-[var(--text-main)] text-sm">{timeError}</p>
                <button
                    onClick={retry}
                    className="mt-1 px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    if (isTimeLoading) {
        return (
            <div className="glass-card w-full p-10 mb-6 flex flex-col items-center justify-center gap-4 min-h-[260px]">
                <Loader2 className="w-9 h-9 animate-spin text-primary" />
                <p className="text-sm text-[var(--text-muted)] animate-pulse font-medium">Mensinkronisasi Jadwal Sholat...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full mb-6 space-y-3"
        >
            {/* ── Main Card ─────────────────────── */}
            <div className="prayer-card p-6 md:p-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">

                    {/* Left: Clock + Date + Location */}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-1.5 mb-3 opacity-70">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            <span className="text-xs font-semibold tracking-widest text-white/80 uppercase">
                                {locationName || 'Lokasi Saat Ini'}
                            </span>
                        </div>

                        {/* Big Clock */}
                        <div className="flex items-baseline gap-1 justify-center md:justify-start">
                            <span className="text-6xl sm:text-7xl font-bold text-white tracking-tighter font-sans tabular-nums leading-none">
                                {format(currentTime, 'HH:mm', { locale: id })}
                            </span>
                            <span className="text-2xl font-light text-white/50 tabular-nums">
                                {format(currentTime, 'ss', { locale: id })}
                            </span>
                        </div>

                        <p className="mt-2 text-sm md:text-base text-white/70 font-medium">
                            {format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}
                        </p>
                    </div>

                    {/* Right: Countdown Card */}
                    {nextPrayer && (
                        <div className="flex-shrink-0 w-full md:w-auto">
                            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 text-center min-w-[180px]">
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-1">Menuju</p>
                                <h2 className="text-2xl font-bold text-white mb-2">{nextPrayer.name}</h2>
                                <div className="text-4xl font-mono font-bold text-accent tracking-wider tabular-nums">
                                    {formatCountdown()}
                                </div>
                                <p className="text-[11px] text-white/50 mt-2 font-medium">
                                    Pukul {format(nextPrayer.time, 'HH:mm')}
                                </p>

                                {/* Mini progress bar */}
                                <div className="mt-3 h-1 bg-white/15 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-accent rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress * 100}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Prayer Times Row */}
                {todayPrayers && Object.keys(todayPrayers).length > 0 && (
                    <div className="relative z-10 grid grid-cols-5 gap-2 mt-6 pt-5 border-t border-white/10">
                        {PRAYER_ORDER.map(key => {
                            const prayer = todayPrayers[key];
                            if (!prayer) return null;
                            const isNext = nextPrayer?.key === key;
                            return (
                                <motion.div
                                    key={key}
                                    whileHover={{ scale: 1.05 }}
                                    className={`rounded-xl py-2.5 px-1 text-center transition-all duration-300 ${
                                        isNext
                                            ? 'bg-accent/90 shadow-lg'
                                            : 'bg-white/10 hover:bg-white/18'
                                    }`}
                                >
                                    <p className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1 ${isNext ? 'text-slate-900' : 'text-white/60'}`}>
                                        {prayer.name}
                                    </p>
                                    <p className={`text-sm sm:text-base font-bold tabular-nums ${isNext ? 'text-slate-900' : 'text-white'}`}>
                                        {format(prayer.time, 'HH:mm')}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Wisdom Card ───────────────────── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-4 flex items-center gap-4"
            >
                <button
                    onClick={handleGetWisdom}
                    disabled={isWisdomLoading}
                    aria-label="Dapatkan mutiara hikmah"
                    className="flex-shrink-0 flex items-center gap-2 bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-60"
                >
                    {isWisdomLoading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Sparkles className="w-4 h-4" />
                    }
                    <span className="hidden sm:inline">{isWisdomLoading ? 'Memuat...' : 'Hikmah'}</span>
                </button>

                <div className="flex-1 min-w-0">
                    {wisdomFetched ? (
                        <p className="text-sm text-[var(--text-muted)] dark:text-gray-400 italic leading-relaxed line-clamp-3">
                            "{wisdom}"
                        </p>
                    ) : (
                        <p className="text-sm text-[var(--text-muted)]/60 italic">
                            Tekan tombol untuk mendapatkan mutiara hikmah harian ✨
                        </p>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default memo(HeroPrayerCard);
