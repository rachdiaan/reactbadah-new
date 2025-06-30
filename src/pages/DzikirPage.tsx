import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DzikirCard from '../components/DzikirCard';
import Modal from '../components/Modal';
import { DzikirItem } from '../types';

interface DzikirPageProps {
  dzikirData: DzikirItem[];
  type: 'pagi' | 'petang';
}

const DzikirPage: React.FC<DzikirPageProps> = ({ dzikirData, type }) => {
  const [modalContent, setModalContent] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTadabbur = (content: string) => {
    setModalContent(content);
    setModalTitle('Tadabbur');
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {dzikirData.map((dzikir, index) => (
        <motion.div
          key={dzikir.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <DzikirCard dzikir={dzikir} onTadabbur={handleTadabbur} />
        </motion.div>
      ))}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="text-lg leading-relaxed">
          {modalContent.split('\n').map((line, index) => (
            <p key={index} className="mb-2">{line}</p>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default DzikirPage;