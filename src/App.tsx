import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './components/Layout/MainLayout';
import PrayerAlert from './components/PrayerAlert';
import ControlPanel from './components/ControlPanel';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { Loader2 } from 'lucide-react';

const HomePage = lazy(() => import('./pages/HomePage'));
const DzikirPage = lazy(() => import('./pages/DzikirPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));
const QuranPage = lazy(() => import('./pages/QuranPage'));
const QiblaPage = lazy(() => import('./pages/QiblaPage'));
const BoycottPage = lazy(() => import('./pages/BoycottPage'));
const SermonsPage = lazy(() => import('./pages/SermonsPage'));

type Page = 'home' | 'dzikir' | 'quran' | 'qibla' | 'about' | 'documentation' | 'boycott' | 'khutbah';

const PageLoader = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

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
      case 'dzikir':
        return <DzikirPage />;
      case 'quran':
        return <QuranPage />;
      case 'qibla':
        return <QiblaPage />;
      case 'boycott':
        return <BoycottPage />;
      case 'khutbah':
        return <SermonsPage />;
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
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* Settings Panel */}
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
