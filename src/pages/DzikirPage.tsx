import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sunrise, Sunset } from 'lucide-react';
import DzikirCard from '../components/DzikirCard';
import Modal from '../components/Modal';
import { DzikirItem } from '../types';
import { dzikirDataPagi, dzikirDataPetang } from '../data/dzikirData';

type DzikirType = 'pagi' | 'petang';

const DzikirPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DzikirType>('pagi');
  const [modalContent, setModalContent] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTadabbur = (content: string) => {
    setModalContent(content);
    setModalTitle('Tadabbur');
    setIsModalOpen(true);
  };

  const currentData: DzikirItem[] = activeTab === 'pagi' ? dzikirDataPagi : dzikirDataPetang;

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-2 flex gap-2 sticky top-2 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
      >
        <button
          onClick={() => setActiveTab('pagi')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'pagi'
              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-400/30'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
        >
          <Sunrise className="w-5 h-5" />
          Dzikir Pagi
        </button>
        <button
          onClick={() => setActiveTab('petang')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'petang'
              ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg shadow-orange-400/30'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
        >
          <Sunset className="w-5 h-5" />
          Dzikir Petang
        </button>
      </motion.div>

      {/* Dzikir Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'pagi' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: activeTab === 'pagi' ? 20 : -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {currentData.map((dzikir, index) => (
            <motion.div
              key={dzikir.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DzikirCard dzikir={dzikir} onTadabbur={handleTadabbur} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          {modalContent.split('\n').map((line, index) => (
            <p key={index} className="mb-2">{line}</p>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default DzikirPage;