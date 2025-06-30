import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { DzikirItem } from '../types';
import { useGeminiAI } from '../hooks/useGeminiAI';

interface DzikirCardProps {
  dzikir: DzikirItem;
  onTadabbur: (content: string) => void;
}

const DzikirCard: React.FC<DzikirCardProps> = ({ dzikir, onTadabbur }) => {
  const [currentTaps, setCurrentTaps] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { getTadabbur, isLoading } = useGeminiAI();

  const handleCardClick = () => {
    if (currentTaps < dzikir.total_taps && !isCompleted) {
      const newTaps = currentTaps + 1;
      setCurrentTaps(newTaps);
      
      if (newTaps === dzikir.total_taps) {
        setIsCompleted(true);
      }
    }
  };

  const handleTadabbur = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const items = dzikir.verses || dzikir.content || [];
    const arabicText = items.map(item => item.arabic).join(" ");
    const translation = items.map(item => item.translation_id).join(" ");
    
    const tadabburText = await getTadabbur(arabicText, translation);
    onTadabbur(tadabburText);
  };

  const progressPercentage = (currentTaps / dzikir.total_taps) * 100;

  const renderContent = () => {
    const items = dzikir.verses || dzikir.content || [];
    
    return items.map((item, index) => (
      <div key={index} className="mt-4 pt-4 border-t border-white/10 first:border-t-0 first:pt-0 first:mt-2">
        {item.ayat_number && (
          <p className="text-md font-bold mb-2 text-blue-300">
            Ayat {item.ayat_number} {(item as any).title_extra || ''}
          </p>
        )}
        <p className="arabic-text mb-4">{item.arabic}</p>
        <p className="text-sm italic mb-2 text-blue-300 opacity-80">{item.latin}</p>
        <p className="text-sm text-slate-300">{item.translation_id}</p>
      </div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
        isCompleted ? 'completed' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow pr-4">
          <h2 className="text-xl font-bold text-white mb-2">{dzikir.title}</h2>
          {dzikir.subtitle_ar && (
            <div className="flex items-center justify-between text-slate-400">
              <p className="font-medium">{dzikir.subtitle_en} - {dzikir.translation}</p>
              <p className="text-lg" dir="rtl">{dzikir.subtitle_ar}</p>
            </div>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTadabbur}
          disabled={isLoading}
          className="flex items-center gap-1 bg-white/5 text-sm py-1 px-3 rounded-full ml-2 flex-shrink-0 hover:bg-white/10 transition-colors duration-300 border-0 text-yellow-300 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {isLoading ? '...' : 'Tadabbur'}
        </motion.button>
      </div>

      <div className="content-container">
        {renderContent()}
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center text-sm font-medium text-slate-300 mb-2">
          <span>Hitungan</span>
          <span>{currentTaps} / {dzikir.total_taps}</span>
        </div>
        <div className="rounded-full overflow-hidden bg-black/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
            className="h-2 rounded-full bg-yellow-300"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DzikirCard;