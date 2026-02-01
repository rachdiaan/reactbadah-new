import React from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset } from 'lucide-react';
import HeroPrayerCard from '../components/HeroPrayerCard';

interface HomePageProps {
  onNavigate: (page: 'dzikir-pagi' | 'dzikir-petang') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] text-center w-full">
      <HeroPrayerCard />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('dzikir-pagi')}
          className="glass-card p-8 cursor-pointer text-center w-full flex flex-col items-center group hover:border-accent/40 bg-white/60"
        >
          <div className="p-4 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 mb-4 group-hover:shadow-lg transition-all">
            <Sunrise className="w-12 h-12 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">Dzikir Pagi</h3>
          <p className="text-gray-500 text-sm">Mulai harimu dengan mengingat Allah</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('dzikir-petang')}
          className="glass-card p-8 cursor-pointer text-center w-full flex flex-col items-center group hover:border-accent/40 bg-white/60"
        >
          <div className="p-4 rounded-full bg-gradient-to-br from-orange-100 to-red-100 mb-4 group-hover:shadow-lg transition-all">
            <Sunset className="w-12 h-12 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">Dzikir Petang</h3>
          <p className="text-gray-500 text-sm">Akhiri harimu dengan ketenangan</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;