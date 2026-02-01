import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Heart, Code, Book } from 'lucide-react';

const AboutPage: React.FC = () => {
  const sources = [
    { name: 'quran.com', url: 'https://quran.com' },
    { name: 'almatsurat.net', url: 'https://almatsurat.net' },
    { name: 'radioadzanfmbandung.com', url: 'https://radioadzanfmbandung.com' }
  ];

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Progressive Web App</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Sebagai sebuah karya digital yang inovatif dari <strong>Rachdian Habi Yahya</strong>,
          aplikasi ini hadir dalam bentuk <strong>Progressive Web App (PWA)</strong> canggih yang
          dirancang untuk memperkaya pengalaman spiritual harian Anda. Aplikasi ini secara dinamis
          mengintegrasikan amalan dzikir Al-Ma'tsurat Sugro dengan informasi jadwal shalat yang
          akurat untuk wilayah Bandung, disajikan melalui antarmuka <em>liquid glass</em> yang
          modern dan sangat responsif.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Open Source & Kontribusi</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Terinspirasi dari aliiflam.com, website ini dirancang open source, silahkan berkontribusi
          aktif, bila ada kesalahan dalam website terutama ayat dan doa mohon untuk melaporkan ke{' '}
          <a
            href="mailto:rachdiaaan@gmail.com"
            className="text-primary hover:text-primary-dark underline transition-colors font-medium"
          >
            rachdiaaan@gmail.com
          </a>. Jika setelah ada balasan email konfirmasi perbaikan namun belum terlihat perubahan,
          silahkan hapus cache/hard reload website ini, terima kasih.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Book className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Sumber Data</h3>
        </div>
        <ul className="space-y-3">
          {sources.map((source, index) => (
            <motion.li
              key={source.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors group font-medium"
              >
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {source.name}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Fitur Utama</h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li>• Widget jadwal shalat real-time untuk wilayah Bandung</li>
          <li>• Dzikir Al-Ma'tsurat pagi dan petang dengan penghitung tap</li>
          <li>• Refleksi (Tadabbur) bertenaga AI untuk setiap dzikir</li>
          <li>• Notifikasi waktu shalat dengan animasi yang indah</li>
          <li>• Desain liquid glass yang modern dan responsif</li>
          <li>• Progressive Web App yang dapat diinstall</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default AboutPage;