import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/HomePage';
import DzikirPage from './pages/DzikirPage';
import AboutPage from './pages/AboutPage';
import DocumentationPage from './pages/DocumentationPage';
import QuranPage from './pages/QuranPage';
import QiblaPage from './pages/QiblaPage';
import PrayerAlert from './components/PrayerAlert';
import ControlPanel from './components/ControlPanel';
import { dzikirDataPagi, dzikirDataPetang } from './data/dzikirData';
import { usePrayerTimes } from './hooks/usePrayerTimes';

type Page = 'home' | 'dzikir-pagi' | 'dzikir-petang' | 'quran' | 'qibla' | 'about' | 'documentation';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showControls, setShowControls] = useState(false);
  const {
    showPrayerAlert,
    alertPrayer,
    dismissAlert,
    nextPrayer,
    calculationMethod,
    changeMethod,
    availableMethods,
    locationName
  } = usePrayerTimes();

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerPrayerAlert = () => {
    if (nextPrayer) {
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
      case 'quran':
        return <QuranPage />;
      case 'qibla':
        return <QiblaPage />;
      case 'about':
        return <AboutPage />;
      case 'documentation':
        return <DocumentationPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onToggleSettings={() => setShowControls(true)}
    >
      <div className="liquid-bg" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      {/* Settings Panel (Reusing ControlPanel as Settings Modal) */}
      <ControlPanel
        isVisible={showControls}
        onToggle={() => setShowControls(!showControls)}
        onNavigate={handleNavigate}
        onTriggerAlert={triggerPrayerAlert}
        currentMethod={calculationMethod}
        onMethodChange={changeMethod}
        availableMethods={availableMethods}
        locationName={locationName}
      />

      {/* Prayer Time Alert */}
      <PrayerAlert
        isVisible={showPrayerAlert}
        prayer={alertPrayer}
        onDismiss={dismissAlert}
      />
    </MainLayout>
  );
}

export default App;