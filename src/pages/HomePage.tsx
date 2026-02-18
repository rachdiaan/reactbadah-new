import React from 'react';
import { motion } from 'framer-motion';
import { Book, BookOpen, Compass, Mic, Ban } from 'lucide-react';
import HeroPrayerCard from '../components/HeroPrayerCard';

type Page = 'home' | 'dzikir' | 'quran' | 'qibla' | 'about' | 'documentation' | 'boycott' | 'khutbah';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const featureCards = [
  { id: 'dzikir' as Page, label: 'Dzikir', desc: 'Pagi & Petang', icon: Book, bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 'quran' as Page, label: "Al-Qur'an", desc: 'Baca & dengarkan', icon: BookOpen, bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'qibla' as Page, label: 'Kiblat', desc: 'Arah sholat', icon: Compass, bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'khutbah' as Page, label: 'Khutbah', desc: 'Khutbah Jumat', icon: Mic, bg: 'bg-teal-50 dark:bg-teal-900/20' },
  { id: 'boycott' as Page, label: 'Cek Boikot', desc: 'Cari produk', icon: Ban, bg: 'bg-rose-50 dark:bg-rose-900/20' },
];

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] text-center w-full space-y-6">
      <HeroPrayerCard />

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 text-left px-1">
          Menu Utama
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {featureCards.map((feat, i) => (
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate(feat.id)}
              className="glass-card p-5 cursor-pointer group hover:border-primary/30 bg-white/60 dark:bg-slate-800/60"
            >
              <div className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <feat.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm group-hover:text-primary transition-colors">{feat.label}</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;