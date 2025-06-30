import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrayerTime } from '../types';

interface PrayerAlertProps {
  isVisible: boolean;
  prayer: PrayerTime | null;
  onDismiss: () => void;
}

const PrayerAlert: React.FC<PrayerAlertProps> = ({ isVisible, prayer, onDismiss }) => {
  return (
    <AnimatePresence>
      {isVisible && prayer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-lg flex flex-col items-center justify-center z-50 cursor-pointer"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center px-4"
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-yellow-300 mb-4 drop-shadow-lg"
            >
              Saatnya Shalat {prayer.name}
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl lg:text-2xl text-white/80 mb-8"
            >
              Waktu shalat telah tiba
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-yellow-300/20 rounded-full flex items-center justify-center mb-8"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-yellow-300/30 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-300 rounded-full animate-pulse" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-white/60"
            >
              Sentuh layar untuk menutup
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrayerAlert;