import React from 'react';
import { motion } from 'framer-motion';
import { Book, BookOpen, Compass, Mic, Ban } from 'lucide-react';
import HeroPrayerCard from '../components/HeroPrayerCard';

type Page = 'home' | 'dzikir' | 'quran' | 'qibla' | 'about' | 'documentation' | 'boycott' | 'khutbah';

interface HomePageProps {
    onNavigate: (page: Page) => void;
}

const featureCards = [
    {
        id: 'dzikir' as Page,
        label: 'Dzikir',
        desc: 'Pagi & Petang',
        icon: Book,
        gradient: 'from-amber-400 to-orange-400',
        glow: 'shadow-amber-200 dark:shadow-amber-900/40',
        bg: 'bg-amber-50 dark:bg-amber-900/15',
    },
    {
        id: 'quran' as Page,
        label: "Al-Qur'an",
        desc: 'Baca & dengarkan',
        icon: BookOpen,
        gradient: 'from-emerald-400 to-teal-500',
        glow: 'shadow-emerald-200 dark:shadow-emerald-900/40',
        bg: 'bg-emerald-50 dark:bg-emerald-900/15',
    },
    {
        id: 'qibla' as Page,
        label: 'Kiblat',
        desc: 'Arah sholat',
        icon: Compass,
        gradient: 'from-primary-400 to-primary-600',
        glow: 'shadow-blue-200 dark:shadow-blue-900/40',
        bg: 'bg-blue-50 dark:bg-blue-900/15',
    },
    {
        id: 'khutbah' as Page,
        label: 'Khutbah',
        desc: 'Khutbah Jumat',
        icon: Mic,
        gradient: 'from-teal-400 to-cyan-500',
        glow: 'shadow-teal-200 dark:shadow-teal-900/40',
        bg: 'bg-teal-50 dark:bg-teal-900/15',
    },
    {
        id: 'boycott' as Page,
        label: 'Cek Boikot',
        desc: 'Cari produk',
        icon: Ban,
        gradient: 'from-rose-400 to-red-500',
        glow: 'shadow-rose-200 dark:shadow-rose-900/40',
        bg: 'bg-rose-50 dark:bg-rose-900/15',
    },
];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
};

const item = {
    hidden: { opacity: 0, y: 18, scale: 0.96 },
    show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } },
};

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col items-center w-full space-y-5 pb-4">
            <HeroPrayerCard />

            {/* ── Feature Grid ────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="w-full"
            >
                <div className="ornament-divider mb-4">Menu Utama</div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                >
                    {featureCards.map((feat) => (
                        <motion.button
                            key={feat.id}
                            variants={item}
                            whileHover={{ y: -4, scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => onNavigate(feat.id)}
                            className="glass-card p-5 text-left group hover:border-primary/25 bg-white/60 dark:bg-slate-800/50 focus-visible:outline-primary"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform duration-300 shadow-sm ${feat.glow}`}>
                                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center shadow-sm`}>
                                    <feat.icon className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            <h4 className="font-bold text-[var(--text-main)] text-sm group-hover:text-primary transition-colors duration-200">
                                {feat.label}
                            </h4>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{feat.desc}</p>
                        </motion.button>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HomePage;
