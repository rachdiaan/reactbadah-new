import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, FileText, Bell, Settings, X, Moon, Sun, Eye, EyeOff, Play } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface ControlPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  onNavigate: (page: 'home' | 'about' | 'documentation') => void;
  onTriggerAlert: () => void;
  // New props
  currentMethod?: string;
  onMethodChange?: (methodId: string) => void;
  availableMethods?: { id: string; name: string }[];
  locationName?: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isVisible,
  onToggle,
  onNavigate,
  onTriggerAlert,
  currentMethod,
  onMethodChange,
  availableMethods = [],
  locationName
}) => {
  const [activeTab, setActiveTab] = React.useState<'general' | 'settings'>('general');
  const {
    isDarkMode, toggleDarkMode,
    showTranslation, toggleTranslation,
    showVerseActions, toggleVerseActions,
    arabicFontSize, setArabicFontSize
  } = useSettings();
  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 glass-card p-3 hover:bg-white/20 transition"
        title="Toggle Controls"
      >
        {isVisible ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Settings className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Control Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-20 right-4 z-40 glass-card p-4 w-72 max-h-[80vh] overflow-y-auto"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-4 bg-white/10 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'general' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-white/10'
                  }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${activeTab === 'settings' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:bg-white/10'
                  }`}
              >
                Settings
              </button>
            </div>

            {activeTab === 'general' ? (
              <div className="space-y-2">
                <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Navigation</div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('home')}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-primary/5 transition text-gray-700 text-sm font-medium"
                >
                  <Home className="w-4 h-4 text-primary" />
                  Home
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('about')}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-primary/5 transition text-gray-700 text-sm font-medium"
                >
                  <Info className="w-4 h-4 text-primary" />
                  About
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('documentation')}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-primary/5 transition text-gray-700 text-sm font-medium"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  Documentation
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onTriggerAlert}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-primary/5 transition text-gray-700 text-sm font-medium"
                >
                  <Bell className="w-4 h-4 text-primary" />
                  Test Notification
                </motion.button>

                {onMethodChange && availableMethods.length > 0 && (
                  <div className="pt-4 mt-2 border-t border-gray-100">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Prayer Calculation</div>
                    <select
                      value={currentMethod}
                      onChange={(e) => onMethodChange(e.target.value)}
                      className="w-full bg-gray-50 text-gray-700 text-xs rounded-lg p-2 border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      {availableMethods.map(method => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                    {locationName && (
                      <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 justify-center">
                        📍 {locationName}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual Settings */}
                <div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Tampilan</div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/50 mb-2">
                    <div className="flex items-center gap-2">
                      {isDarkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-medium text-gray-700">Mode Gelap</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Content Settings */}
                <div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Konten</div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/50 mb-2">
                    <div className="flex items-center gap-2">
                      {showTranslation ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Terjemahan</span>
                        <span className="text-[10px] text-gray-400">Tampilkan arti ayat</span>
                      </div>
                    </div>
                    <button
                      onClick={toggleTranslation}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${showTranslation ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${showTranslation ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50/50 mb-2">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Tombol Aksi</span>
                        <span className="text-[10px] text-gray-400">Play, Bookmark, dll</span>
                      </div>
                    </div>
                    <button
                      onClick={toggleVerseActions}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${showVerseActions ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${showVerseActions ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Typography Settings */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Ukuran Teks Arab</div>
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{arabicFontSize}px</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-100 mb-3 shadow-inner">
                    <p className="font-serif text-right text-gray-800 leading-loose" style={{ fontSize: `${arabicFontSize}px` }}>
                      بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">Kecil</span>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      step="2"
                      value={arabicFontSize}
                      onChange={(e) => setArabicFontSize(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-xs text-gray-400">Besar</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ControlPanel;