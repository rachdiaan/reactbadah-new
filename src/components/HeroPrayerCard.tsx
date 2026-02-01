import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Loader2 } from 'lucide-react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useGeminiAI } from '../hooks/useGeminiAI';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const HeroPrayerCard: React.FC = () => {
    const {
        currentTime,
        nextPrayer,
        countdown,
        todayPrayers,
        locationName,
        isLoading: isTimeLoading,
        error: timeError
    } = usePrayerTimes();

    const { getDailyWisdom, isLoading: isWisdomLoading } = useGeminiAI();
    const [wisdom, setWisdom] = useState<string>("Sentuh tombol untuk mendapatkan inspirasi harian.");

    const handleGetWisdom = async () => {
        if (nextPrayer) {
            const result = await getDailyWisdom(nextPrayer.name);
            setWisdom(result);
        }
    };

    const formatCountdown = () => {
        return `${String(countdown.hours).padStart(2, '0')}:${String(countdown.minutes).padStart(2, '0')}:${String(countdown.seconds).padStart(2, '0')}`;
    };

    if (timeError) {
        return (
            <div className="glass-card w-full p-8 mb-8 flex items-center justify-center text-red-500 bg-red-50/50">
                <p>Gagal memuat jadwal sholat. Periksa koneksi internet Anda.</p>
            </div>
        );
    }

    if (isTimeLoading) {
        return (
            <div className="glass-card w-full p-12 mb-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-gray-500 animate-pulse">Mensinkronisasi Jadwal Sholat...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full p-8 mb-8 relative overflow-hidden group"
        >
            {/* Dynamic Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 z-0 transition-opacity duration-500 group-hover:opacity-70 dark:opacity-20" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left Side: Time & Location */}
                <div className="text-center md:text-left flex-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-primary/80 dark:text-primary/70">
                        <MapPin className="w-4 h-4" />
                        <p className="text-sm font-medium tracking-wide uppercase">{locationName || "Lokasi Saat Ini"}</p>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-2 tracking-tight font-sans">
                        {format(currentTime, 'HH:mm', { locale: id })}
                        <span className="text-xl sm:text-2xl text-primary/60 ml-2 font-light">{format(currentTime, 'ss', { locale: id })}</span>
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                        {format(currentTime, 'EEEE, d MMMM yyyy', { locale: id })}
                    </p>
                </div>

                {/* Right Side: Next Prayer Countdown */}
                {nextPrayer && (
                    <div className="flex-1 w-full md:w-auto">
                        <div className="prayer-card p-6 text-center transform hover:scale-105 transition-transform duration-300 relative overflow-hidden shadow-xl shadow-primary/20 dark:shadow-none">
                            <div className="absolute top-0 left-0 w-full h-1 bg-accent/50" />

                            <p className="text-sm font-bold text-white/80 uppercase tracking-widest mb-2">Menuju Waktu</p>
                            <h2 className="text-3xl font-bold text-white mb-1">{nextPrayer.name}</h2>
                            <div className="text-5xl font-mono font-bold text-accent my-2 tracking-wider">
                                {formatCountdown()}
                            </div>
                            <p className="text-xs text-white/60 mt-2">
                                Pukul {format(nextPrayer.time, 'HH:mm')}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Prayer Times Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-8 relative z-10">
                {todayPrayers && Object.entries(todayPrayers).map(([key, prayer]) => {
                    const isNext = nextPrayer?.key === key;
                    return (
                        <motion.div
                            key={key}
                            whileHover={{ y: -2 }}
                            className={`p-3 rounded-2xl text-center border transition-all duration-300 ${isNext
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                                : 'bg-white/40 dark:bg-slate-700/40 border-white/40 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-slate-700/60 hover:border-primary/30'
                                }`}
                        >
                            <p className={`text-xs font-bold uppercase mb-1 ${isNext ? 'text-accent' : 'text-gray-400 dark:text-gray-500'}`}>
                                {prayer.name}
                            </p>
                            <p className={`text-xl font-bold ${isNext ? 'text-white' : 'text-primary'}`}>
                                {format(prayer.time, 'HH:mm')}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Wisdom Section (Collapsible/Integrated) */}
            <div className="mt-8 pt-6 border-t border-gray-200/20 dark:border-white/10 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <button
                        onClick={handleGetWisdom}
                        disabled={isWisdomLoading}
                        className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 text-primary px-4 py-2 rounded-full text-sm font-semibold transition-colors w-full md:w-auto justify-center"
                    >
                        <Sparkles className="w-4 h-4" />
                        {isWisdomLoading ? 'Mencari Inspirasi...' : 'Mutiara Hikmah'}
                    </button>

                    <div className="text-center md:text-left text-sm text-gray-600 dark:text-gray-400 italic flex-1">
                        "{wisdom}"
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default HeroPrayerCard;
