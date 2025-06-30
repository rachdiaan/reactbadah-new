import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DzikirPage from './pages/DzikirPage';
import AboutPage from './pages/AboutPage';
import DocumentationPage from './pages/DocumentationPage';
import PrayerAlert from './components/PrayerAlert';
import ControlPanel from './components/ControlPanel';
import BackToTop from './components/BackToTop';
import { dzikirDataPagi, dzikirDataPetang } from './data/dzikirData';
import { usePrayerTimes } from './hooks/usePrayerTimes';

type Page = 'home' | 'dzikir-pagi' | 'dzikir-petang' | 'about' | 'documentation';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showControls, setShowControls] = useState(false);
  const { showPrayerAlert, alertPrayer, dismissAlert, nextPrayer } = usePrayerTimes();

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const triggerPrayerAlert = () => {
    if (nextPrayer) {
      // Simulate prayer alert for demo
      const demoAlert = { ...nextPrayer, name: `Demo ${nextPrayer.name}` };
      // This would normally be handled by the usePrayerTimes hook
      // For demo purposes, we'll just show a temporary alert
      alert(`Demo: Waktu ${nextPrayer.name} akan segera tiba!`);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'dzikir-pagi':
        return <DzikirPage dzikirData={dzikirDataPagi} type="pagi" />;
      case 'dzikir-petang':
        return <DzikirPage dzikirData={dzikirDataPetang} type="petang" />;
      case 'about':
        return <AboutPage />;
      case 'documentation':
        return <DocumentationPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="liquid-bg" />
      
      <div className="container mx-auto p-4 md:p-6 max-w-4xl min-h-screen flex flex-col relative z-10">
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          showBackButton={currentPage !== 'home'}
        />

        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow"
        >
          {renderPage()}
        </motion.main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 py-6 text-slate-400"
        >
          <p>&copy; 2025. Created with ❤️ by Rachdian</p>
        </motion.footer>
      </div>

      {/* Control Panel */}
      <ControlPanel 
        isVisible={showControls}
        onToggle={() => setShowControls(!showControls)}
        onNavigate={handleNavigate}
        onTriggerAlert={triggerPrayerAlert}
      />

      {/* Back to Top Button */}
      <BackToTop />

      {/* Prayer Time Alert */}
      <PrayerAlert
        isVisible={showPrayerAlert}
        prayer={alertPrayer}
        onDismiss={dismissAlert}
      />
    </div>
  );
}

export default App;