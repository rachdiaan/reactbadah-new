import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-4"
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-label={title}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg max-h-[80vh] flex flex-col
                            rounded-3xl overflow-hidden
                            bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl
                            border border-white/70 dark:border-white/10
                            shadow-2xl shadow-black/20"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/8 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-xl bg-accent/15 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <h3 className="text-base font-bold text-[var(--text-main)]">{title}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Tutup"
                                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 text-[var(--text-muted)] transition-colors"
                            >
                                <X className="w-4.5 h-4.5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 no-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
