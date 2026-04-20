import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrayerTime } from '../types';
import { format } from 'date-fns';

interface PrayerAlertProps {
    isVisible: boolean;
    prayer: PrayerTime | null;
    onDismiss: () => void;
}

// Adhan arabics per prayer (simplified)
const ARABIC_NAME: Record<string, string> = {
    Subuh:   'الصُّبْح',
    Dzuhur:  'الظُّهْر',
    Ashar:   'الْعَصْر',
    Maghrib: 'الْمَغْرِب',
    Isya:    'الْعِشَاء',
};

const PrayerAlert: React.FC<PrayerAlertProps> = ({ isVisible, prayer, onDismiss }) => {
    // Close on Escape
    useEffect(() => {
        if (!isVisible) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onDismiss(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isVisible, onDismiss]);

    const arabicName = prayer ? (ARABIC_NAME[prayer.name] || prayer.name) : '';

    return (
        <AnimatePresence>
            {isVisible && prayer && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                    role="alertdialog"
                    aria-modal="true"
                    aria-label={`Waktu sholat ${prayer.name}`}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                    onClick={onDismiss}
                    style={{
                        background: 'linear-gradient(160deg, #0a1628 0%, #0d2240 40%, #0a2035 70%, #0f1a2e 100%)',
                    }}
                >
                    {/* Animated radial glow */}
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(79,134,184,0.25) 0%, transparent 65%)' }}
                        />
                        <motion.div
                            animate={{ scale: [1.1, 0.95, 1.1], opacity: [0.15, 0.3, 0.15] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
                            style={{ background: 'radial-gradient(ellipse, rgba(232,197,71,0.12) 0%, transparent 60%)' }}
                        />
                    </div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.08 }}
                        className="relative z-10 text-center px-6 max-w-lg select-none"
                    >
                        {/* Ornamental dots */}
                        <div className="flex justify-center gap-2 mb-6">
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                    className="w-1.5 h-1.5 rounded-full bg-accent"
                                />
                            ))}
                        </div>

                        {/* Small label */}
                        <p className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase mb-4">
                            Waktu Sholat
                        </p>

                        {/* Prayer name - Arabic */}
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="text-4xl md:text-5xl text-white/30 font-arabic mb-3 leading-tight"
                            style={{ fontFamily: '"Scheherazade New","Amiri",serif' }}
                        >
                            {arabicName}
                        </motion.p>

                        {/* Prayer name - Indonesian */}
                        <motion.h1
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tight"
                        >
                            {prayer.name}
                        </motion.h1>

                        {/* Time */}
                        {prayer.time && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-mono font-bold text-accent/90 mb-6 tabular-nums"
                            >
                                {format(prayer.time, 'HH:mm')}
                            </motion.p>
                        )}

                        {/* Pulsing ring */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
                            className="relative w-24 h-24 mx-auto mb-8"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-accent/30"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                className="absolute inset-0 rounded-full bg-primary/30"
                            />
                            <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <motion.div
                                    animate={{ scale: [0.9, 1.1, 0.9] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-10 h-10 rounded-full bg-accent"
                                />
                            </div>
                        </motion.div>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-sm text-white/35 tracking-widest"
                        >
                            Sentuh untuk menutup
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PrayerAlert;
