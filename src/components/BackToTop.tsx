import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsVisible(window.scrollY > 320);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.7, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 8 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Kembali ke atas"
                    className="fixed bottom-24 lg:bottom-20 right-4 lg:right-20 z-40 w-10 h-10 rounded-2xl flex items-center justify-center
                        bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl
                        border border-white/60 dark:border-white/10
                        shadow-lg shadow-black/8 hover:shadow-glow
                        text-primary transition-all"
                >
                    <ArrowUp className="w-4.5 h-4.5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
