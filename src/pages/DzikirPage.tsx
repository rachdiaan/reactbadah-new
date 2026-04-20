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
    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTadabbur = (content: string) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const currentData: DzikirItem[] = activeTab === 'pagi' ? dzikirDataPagi : dzikirDataPetang;

    return (
        <div className="space-y-5 pb-4">
            {/* ── Tab Switcher ────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-flat p-1.5 flex gap-1.5 sticky top-2 z-30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl"
            >
                {(['pagi', 'petang'] as DzikirType[]).map((tab) => {
                    const active = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            aria-pressed={active}
                            className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-250 overflow-hidden
                                ${active ? 'text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-gray-50 dark:hover:bg-white/6'}`}
                        >
                            {active && (
                                <motion.div
                                    layoutId="tab-bg"
                                    className={`absolute inset-0 rounded-xl ${tab === 'pagi'
                                        ? 'bg-gradient-to-r from-amber-400 to-orange-400 shadow-amber-400/30'
                                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-indigo-500/30'
                                    }`}
                                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                {tab === 'pagi'
                                    ? <Sunrise className="w-4 h-4" />
                                    : <Sunset className="w-4 h-4" />
                                }
                                {tab === 'pagi' ? 'Dzikir Pagi' : 'Dzikir Petang'}
                            </span>
                        </button>
                    );
                })}
            </motion.div>

            {/* ── Dzikir Cards ─────────────── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'pagi' ? -24 : 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === 'pagi' ? 24 : -24 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-5"
                >
                    {currentData.map((dzikir, index) => (
                        <motion.div
                            key={dzikir.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.3 }}
                        >
                            <DzikirCard dzikir={dzikir} onTadabbur={handleTadabbur} />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* ── Tadabbur Modal ────────────── */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tadabbur"
            >
                <div className="text-sm md:text-base leading-relaxed text-[var(--text-muted)]">
                    {modalContent.split('\n').map((line, i) => (
                        <p key={i} className={line ? 'mb-3' : 'mb-1'}>{line}</p>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default DzikirPage;
