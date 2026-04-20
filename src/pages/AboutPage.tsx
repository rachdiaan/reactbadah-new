import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Code2, BookOpen, Sparkles, Globe } from 'lucide-react';

const sources = [
    { name: 'alquran.cloud', desc: 'API Al-Qur\'an & audio', url: 'https://alquran.cloud' },
    { name: 'aladhan.com', desc: 'Jadwal sholat global', url: 'https://aladhan.com' },
    { name: 'islamicnetwork.com', desc: 'Khutbah & konten Islam', url: 'https://islamicnetwork.com' },
];

const features = [
    { icon: '🕐', text: 'Jadwal sholat real-time dengan GPS' },
    { icon: '📿', text: 'Dzikir Al-Ma\'tsurat pagi & petang' },
    { icon: '🤖', text: 'Tadabbur bertenaga Gemini AI' },
    { icon: '📖', text: 'Al-Qur\'an 114 surat + audio Alafasy' },
    { icon: '🧭', text: 'Kompas kiblat interaktif' },
    { icon: '🕌', text: 'Khutbah Jumat dari UAE Awqaf' },
    { icon: '🔖', text: 'Bookmark ayat dengan localStorage' },
    { icon: '🌙', text: 'Dark mode + ukuran teks Arab kustom' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

const AboutPage: React.FC = () => {
    return (
        <div className="space-y-5 max-w-3xl mx-auto pb-10">

            {/* ── Hero banner ──────────── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="prayer-card p-8 text-center"
            >
                <div className="relative z-10">
                    <div className="text-5xl mb-3">🕌</div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Ibadah Checkpoint</h1>
                    <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto">
                        Asisten digital ibadah harian Muslim — jadwal sholat, dzikir, Al-Qur'an, & kiblat dalam satu aplikasi.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        Bertenaga Gemini AI
                    </div>
                </div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
            >
                {/* About */}
                <motion.div variants={item} className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Code2 className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <h3 className="font-bold text-[var(--text-main)]">Tentang Aplikasi</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        Karya <strong className="text-[var(--text-main)]">Rachdian Habi Yahya</strong> — sebuah
                        <strong> Progressive Web App</strong> modern yang mengintegrasikan amalan dzikir Al-Ma'tsurat dengan
                        jadwal shalat akurat dan fitur AI, melalui antarmuka <em>liquid glass</em> yang responsif.
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div variants={item} className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/25 flex items-center justify-center">
                            <BookOpen className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="font-bold text-[var(--text-main)]">Fitur Utama</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {features.map((f, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50/60 dark:bg-white/4">
                                <span className="text-base leading-none mt-0.5">{f.icon}</span>
                                <span className="text-xs font-medium text-[var(--text-muted)] leading-snug">{f.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Open Source */}
                <motion.div variants={item} className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/25 flex items-center justify-center">
                            <Heart className="w-4.5 h-4.5 text-rose-500" />
                        </div>
                        <h3 className="font-bold text-[var(--text-main)]">Open Source & Kontribusi</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                        Terinspirasi dari aliiflam.com. Website ini bersifat open source — silakan berkontribusi.
                        Bila ada kesalahan dalam ayat atau doa, laporkan ke{' '}
                        <a href="mailto:rachdiaaan@gmail.com" className="text-primary font-semibold hover:underline">
                            rachdiaaan@gmail.com
                        </a>.
                    </p>
                </motion.div>

                {/* Sources */}
                <motion.div variants={item} className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/25 flex items-center justify-center">
                            <Globe className="w-4.5 h-4.5 text-blue-500" />
                        </div>
                        <h3 className="font-bold text-[var(--text-main)]">Sumber Data</h3>
                    </div>
                    <div className="space-y-2">
                        {sources.map((s) => (
                            <a
                                key={s.name}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 dark:bg-white/4 hover:bg-primary/6 dark:hover:bg-white/8 transition-colors group"
                            >
                                <div>
                                    <p className="text-sm font-bold text-[var(--text-main)] group-hover:text-primary transition-colors">{s.name}</p>
                                    <p className="text-xs text-[var(--text-muted)]">{s.desc}</p>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-primary transition-colors flex-shrink-0" />
                            </a>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AboutPage;
