import React from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset } from 'lucide-react';
import PrayerWidget from '../components/PrayerWidget';

interface HomePageProps {
  onNavigate: (page: 'dzikir-pagi' | 'dzikir-petang') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center p-4">
      <PrayerWidget />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Pilih Waktu Dzikir</h2>
        
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('dzikir-pagi')}
            className="glass-card p-6 cursor-pointer text-center w-full"
          >
            <Sunrise className="w-10 h-10 text-yellow-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">Dzikir Pagi</h3>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('dzikir-petang')}
            className="glass-card p-6 cursor-pointer text-center w-full"
          >
            <Sunset className="w-10 h-10 text-orange-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">Dzikir Petang</h3>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;