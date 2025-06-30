import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface NavigationProps {
  currentPage: 'home' | 'dzikir-pagi' | 'dzikir-petang' | 'about' | 'documentation';
  onNavigate: (page: 'home' | 'dzikir-pagi' | 'dzikir-petang' | 'about' | 'documentation') => void;
  showBackButton?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate, showBackButton = false }) => {
  const getTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'Al-Ma\'tsurat Sugro';
      case 'dzikir-pagi':
        return 'Al-Ma\'tsurat Sugro';
      case 'dzikir-petang':
        return 'Al-Ma\'tsurat Sugro';
      case 'about':
        return 'Tentang Aplikasi';
      case 'documentation':
        return 'Dokumentasi';
      default:
        return 'Al-Ma\'tsurat Sugro';
    }
  };

  const getSubtitle = () => {
    switch (currentPage) {
      case 'dzikir-pagi':
        return 'Dzikir Pagi';
      case 'dzikir-petang':
        return 'Dzikir Petang';
      case 'about':
        return 'Informasi dan Sumber Data';
      case 'documentation':
        return 'Panduan Lengkap Aplikasi';
      default:
        return '';
    }
  };

  return (
    <header className="text-center mb-6 relative">
      {showBackButton && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('home')}
          className="absolute left-0 top-1/2 -translate-y-1/2 glass-card p-2 hover:bg-white/10 transition z-20"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </motion.button>
      )}
      
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-white text-shadow-lg"
      >
        {getTitle()}
      </motion.h1>
      
      {getSubtitle() && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-300 mt-1"
        >
          {getSubtitle()}
        </motion.p>
      )}
    </header>
  );
};

export default Navigation;