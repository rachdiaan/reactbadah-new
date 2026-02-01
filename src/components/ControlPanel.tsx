import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Info, FileText, Bell, Settings, X } from 'lucide-react';

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
            className="fixed bottom-20 right-4 z-40 glass-card p-4 space-y-2"
          >
            <div className="text-white text-sm font-semibold mb-3">Quick Actions</div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 w-full glass-card p-2 hover:bg-white/20 transition text-white text-sm"
              title="Home"
            >
              <Home className="w-4 h-4" />
              Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('about')}
              className="flex items-center gap-2 w-full glass-card p-2 hover:bg-white/20 transition text-white text-sm"
              title="About"
            >
              <Info className="w-4 h-4" />
              About
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('documentation')}
              className="flex items-center gap-2 w-full glass-card p-2 hover:bg-white/20 transition text-white text-sm"
              title="Documentation"
            >
              <FileText className="w-4 h-4" />
              Docs
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTriggerAlert}
              className="flex items-center gap-2 w-full glass-card p-2 hover:bg-white/20 transition text-white text-sm"
              title="Test Prayer Alert"
            >
              <Bell className="w-4 h-4" />
              Alert
            </motion.button>

            {onMethodChange && availableMethods.length > 0 && (
              <div className="pt-2 border-t border-white/10 mt-2">
                <div className="text-white text-xs font-semibold mb-2 opacity-80">Calculation Method</div>
                <select
                  value={currentMethod}
                  onChange={(e) => onMethodChange(e.target.value)}
                  className="w-full bg-white/10 text-white text-xs rounded p-1 border border-white/20 focus:outline-none focus:border-white/50 [&>option]:text-black"
                >
                  {availableMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
                {locationName && (
                  <div className="text-[10px] text-white/60 mt-1 italic text-center">
                    Using: {locationName}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ControlPanel;