import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useGeminiAI } from '../hooks/useGeminiAI';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const PrayerWidget: React.FC = () => {
  const { currentTime, nextPrayer, countdown, todayPrayers } = usePrayerTimes();
  const { getDailyWisdom, isLoading } = useGeminiAI();
  const [wisdom, setWisdom] = useState<string>("Sentuh tombol untuk mendapatkan inspirasi harian.");

  const handleGetWisdom = async () => {
    const result = await getDailyWisdom(nextPrayer?.name);
    setWisdom(result);
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm:ss', { locale: id });
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEEE, d MMMM yyyy', { locale: id });
  };

  const formatCountdown = () => {
    return `${String(countdown.hours).padStart(2, '0')}:${String(countdown.minutes).padStart(2, '0')}:${String(countdown.seconds).padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card w-full max-w-2xl p-6 mb-8"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-blue-300" />
          <p className="text-lg text-blue-300">Jadwal Shalat untuk Wilayah Bandung</p>
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-6 h-6 text-white" />
          <p className="text-4xl md:text-5xl font-bold text-white tracking-wider">
            {formatTime(currentTime)}
          </p>
        </div>
        
        <p className="text-base text-slate-300 mb-4">
          {formatDate(currentTime)}
        </p>
      </div>

      {nextPrayer && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mb-6 p-4 rounded-2xl bg-black/20"
        >
          <p className="font-semibold text-yellow-300 mb-1">
            Menuju Waktu {nextPrayer.name}
          </p>
          <p className="text-3xl md:text-4xl font-bold text-white">
            {formatCountdown()}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {Object.entries(todayPrayers).map(([key, prayer]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`prayer-card text-center ${
              nextPrayer?.key === key ? 'next-prayer-highlight' : ''
            }`}
          >
            <p className="font-semibold text-base text-blue-300 mb-1">
              {prayer.name}
            </p>
            <p className="text-2xl font-bold text-white">
              {format(prayer.time, 'HH:mm')}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGetWisdom}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 w-full font-semibold text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? 'Memuat...' : 'Minta Mutiara Hikmah'}
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-slate-300 text-center leading-relaxed"
        >
          {isLoading ? (
            <div className="flex justify-center">
              <div className="loader w-6 h-6"></div>
            </div>
          ) : (
            wisdom
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PrayerWidget;