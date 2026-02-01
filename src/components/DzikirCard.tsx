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
      <div key={index} className="mt-6 pt-6 border-t border-gray-200/10 first:border-t-0 first:pt-0 first:mt-2">
        {item.ayat_number && (
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">Ayat {item.ayat_number}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">{(item as any).title_extra || ''}</span>
          </div>
        )}
        <p className="arabic-text mb-4 text-right text-3xl leading-loose text-gray-800" style={{ fontFamily: '"Amiri", serif' }}>{item.arabic}</p>
        <p className="text-sm italic mb-2 text-primary/80 font-medium">{item.latin}</p>
        <p className="text-sm text-gray-500 leading-relaxed">{item.translation_id}</p>
      </div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={`glass-card p-6 cursor-pointer transition-all duration-300 ${isCompleted ? 'completed' : ''
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow pr-4">
          <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2">
            {dzikir.title}
            {isCompleted && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Selesai</span>}
          </h2>
          {dzikir.subtitle_ar && (
            <div className="flex flex-col gap-2 mt-2 p-3 bg-gray-50 rounded-xl">
              <p className="text-xl text-right font-serif text-gray-700" dir="rtl">{dzikir.subtitle_ar}</p>
              <div className="h-px bg-gray-200 w-full my-1"></div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{dzikir.subtitle_en} • {dzikir.translation}</p>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTadabbur}
          disabled={isLoading}
          className="flex items-center gap-1 bg-accent/10 text-xs font-bold py-1.5 px-4 rounded-full ml-2 flex-shrink-0 hover:bg-accent/20 transition-colors duration-300 border border-accent/20 text-accent-darker disabled:opacity-50 text-yellow-600"
        >
          <Sparkles className="w-3 h-3" />
          {isLoading ? '...' : 'Tadabbur'}
        </motion.button>
      </div>

      <div className="content-container px-2">
        {renderContent()}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm font-medium text-gray-500 mb-2">
          <span>Progress</span>
          <span className="text-primary">{currentTaps} / {dzikir.total_taps}</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DzikirCard;