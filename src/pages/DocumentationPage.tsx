import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book,
  Code,
  Sparkles,
  Clock,
  Smartphone,
  Database,
  Globe,
  Heart,
  Target,
  Layers,
  Server,
  Monitor,
  Wrench,
  Menu,
  X,
  Compass,
  BookOpen,
  Mic,
  ShieldBan
} from 'lucide-react';

const DocumentationPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const cardClass = "bg-white/50 dark:bg-slate-800/50 border border-gray-100 dark:border-white/10 p-4 rounded-xl shadow-sm";
  const textClass = "text-gray-600 dark:text-gray-300";
  const codeBlockClass = "bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-white/10 p-3 rounded-lg text-xs font-mono text-gray-700 dark:text-gray-300";
  const badgeBase = "px-2 py-1 rounded text-xs font-medium";

  const sections = [
    {
      id: 'overview',
      title: '🚀 Overview Aplikasi',
      icon: <Sparkles className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className={`${textClass} leading-relaxed`}>
            <strong>Al-Ma'tsurat Sugro</strong> adalah Progressive Web App (PWA) komprehensif untuk umat Muslim.
            Menggabungkan dzikir Al-Ma'tsurat pagi & petang, jadwal shalat GPS-based, Al-Qur'an dengan terjemahan & audio,
            kompas kiblat interaktif, khutbah Jumat, gerakan boycott, dan AI-powered tadabbur — semua dalam satu aplikasi modern
            dengan desain <em>liquid glass</em> dan dukungan dark mode penuh.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-2">🎯 Keunggulan Utama</h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• 7 fitur utama dalam 1 aplikasi</li>
                <li>• AI Tadabbur (Google Gemini 2.0 Flash)</li>
                <li>• Jadwal shalat GPS + multiple methods</li>
                <li>• Kompas kiblat sensor device + fallback desktop</li>
                <li>• Al-Qur'an 114 surat + terjemahan + audio</li>
                <li>• Dark/Light mode, responsive, installable</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-2">👥 Target Pengguna</h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• Muslim Milenial & Gen Z</li>
                <li>• Profesional Sibuk</li>
                <li>• Pelajar & Mahasiswa</li>
                <li>• Keluarga Muslim</li>
                <li>• Komunitas Pengajian</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'architecture',
      title: '🏗️ Arsitektur Sistem',
      icon: <Layers className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className={`${textClass} leading-relaxed`}>
            Dibangun sepenuhnya client-side dengan React + TypeScript + Vite. Tidak memerlukan backend — semua data
            diambil langsung dari REST API publik. State management menggunakan React hooks dan Context API.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Frontend Stack
              </h4>
              <div className="flex flex-wrap gap-1">
                <span className={`${badgeBase} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300`}>React 18</span>
                <span className={`${badgeBase} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300`}>TypeScript 5</span>
                <span className={`${badgeBase} bg-primary/10 text-primary`}>Vite 5</span>
                <span className={`${badgeBase} bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300`}>Tailwind CSS 3</span>
                <span className={`${badgeBase} bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300`}>Framer Motion</span>
                <span className={`${badgeBase} bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300`}>Lucide Icons</span>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                API & Libraries
              </h4>
              <div className="flex flex-wrap gap-1">
                <span className={`${badgeBase} bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300`}>Gemini AI</span>
                <span className={`${badgeBase} bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300`}>AlAdhan API</span>
                <span className={`${badgeBase} bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300`}>Al-Quran Cloud</span>
                <span className={`${badgeBase} bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300`}>Adhan.js</span>
                <span className={`${badgeBase} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300`}>Islamic SDK</span>
                <span className={`${badgeBase} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300`}>Date-fns</span>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Design System
              </h4>
              <div className="flex flex-wrap gap-1">
                <span className={`${badgeBase} bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300`}>Liquid Glass</span>
                <span className={`${badgeBase} bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300`}>Responsive</span>
                <span className={`${badgeBase} bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300`}>Dark Mode</span>
                <span className={`${badgeBase} bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300`}>Glassmorphism</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'features',
      title: '⭐ Fitur Lengkap',
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Jadwal Shalat
              </h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• GPS-based (AlAdhan REST API)</li>
                <li>• Real-time countdown ke waktu berikutnya</li>
                <li>• 5 waktu: Subuh, Dzuhur, Ashar, Maghrib, Isya</li>
                <li>• Multiple calculation methods (KEMENAG, MWL, dll)</li>
                <li>• Alert notification animasi</li>
                <li>• AI-powered mutiara hikmah</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <Book className="w-4 h-4" />
                Dzikir Al-Ma'tsurat
              </h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• Pagi & Petang dalam 1 halaman (tab selector)</li>
                <li>• Tap counter dengan progress bar</li>
                <li>• Arabic typography (Amiri font)</li>
                <li>• Latin transliterasi + terjemahan Indonesia</li>
                <li>• AI Tadabbur per dzikir (Gemini)</li>
                <li>• Completion status & reset</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Al-Qur'an Digital
              </h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• 114 surat lengkap (API alquran.cloud)</li>
                <li>• Teks Arab (Uthmani script)</li>
                <li>• Terjemahan Bahasa Indonesia</li>
                <li>• Audio per ayat (Mishari Al-Afasy)</li>
                <li>• Pencarian surat</li>
                <li>• Info juz, revelationType, jumlah ayat</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Kompas Kiblat
              </h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• Device orientation sensor (real-time)</li>
                <li>• Kalibrasi kualitas (Rendah/Cukup/Akurat)</li>
                <li>• Feedback arah: "Putar kiri/kanan X°"</li>
                <li>• Green glow saat mengarah Ka'bah</li>
                <li>• Desktop fallback: mode statis + drag manual</li>
                <li>• Jarak ke Ka'bah (Haversine formula)</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Khutbah Jumat
              </h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• Data dari UAE Awqaf (Islamic Network SDK)</li>
                <li>• Daftar khutbah per tahun</li>
                <li>• Detail modal dengan konten lengkap</li>
                <li>• Sorted by date (terbaru di atas)</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <ShieldBan className="w-4 h-4" />
                Boycott Israel
              </h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• Data dari Islamic Network SDK</li>
                <li>• Daftar brand per kategori</li>
                <li>• Search dan filter</li>
                <li>• Alternatif brand lokal</li>
              </ul>
            </div>
          </div>

          <div className={cardClass}>
            <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              UI/UX & Design
            </h4>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 text-sm ${textClass}`}>
              <div>• Liquid glass + glassmorphism</div>
              <div>• Full dark/light mode</div>
              <div>• Animated page transitions</div>
              <div>• Mobile bottom nav + overflow</div>
              <div>• Desktop sidebar navigation</div>
              <div>• Responsive (mobile-first)</div>
              <div>• Custom scrollbar & safe area</div>
              <div>• Installable PWA</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'implementation',
      title: '💻 Implementasi Teknis',
      icon: <Code className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3">🎣 Custom Hooks</h4>
              <div className={codeBlockClass + " space-y-1"}>
                <div>usePrayerTimes() → GPS + AlAdhan API</div>
                <div>useGeminiAI() → Tadabbur & Hikmah</div>
                <div>useSettings() → Dark mode, font, preferences</div>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3">📊 State & Context</h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• SettingsContext (dark mode, font size, dll)</li>
                <li>• useState untuk component-local state</li>
                <li>• useRef untuk sensor data & throttling</li>
                <li>• useCallback untuk memoized functions</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3">📂 Struktur File</h4>
              <div className={codeBlockClass + " space-y-1"}>
                <div>src/pages/ → 7 halaman utama</div>
                <div>src/components/ → UI reusable</div>
                <div>src/hooks/ → 3 custom hooks</div>
                <div>src/services/ → quranService, sermonService</div>
                <div>src/contexts/ → SettingsContext</div>
                <div>src/data/ → dzikir JSON data</div>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3">🌐 Browser APIs</h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• Geolocation API → lokasi GPS</li>
                <li>• DeviceOrientation → kompas kiblat</li>
                <li>• localStorage → settings persistence</li>
                <li>• Service Worker → PWA & offline</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'installation',
      title: '🚀 Instalasi & Deployment',
      icon: <Server className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className={cardClass}>
            <h4 className="text-primary font-bold mb-3">💻 System Requirements</h4>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 text-sm ${textClass}`}>
              <div>
                <div className="font-semibold text-primary">Node.js</div>
                <div>v18.0.0+</div>
              </div>
              <div>
                <div className="font-semibold text-primary">npm</div>
                <div>v8.0.0+</div>
              </div>
              <div>
                <div className="font-semibold text-primary">Browser</div>
                <div>Chrome / Safari / Edge</div>
              </div>
              <div>
                <div className="font-semibold text-primary">Deploy</div>
                <div>GitHub Pages</div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h4 className="text-primary font-bold mb-3">🛠️ Setup Development</h4>
            <div className={codeBlockClass + " space-y-1"}>
              <div>git clone https://github.com/rachdiaan/reactbadah-new.git</div>
              <div>cd reactbadah-new</div>
              <div>npm install</div>
              <div>cp .env.example .env   # isi VITE_GEMINI_API_KEY</div>
              <div>npm run dev            # http://localhost:5173</div>
            </div>
          </div>

          <div className={cardClass}>
            <h4 className="text-primary font-bold mb-3">🚢 Deploy ke GitHub Pages</h4>
            <div className={codeBlockClass + " space-y-1"}>
              <div>npm run build          # production build</div>
              <div>npm run deploy         # gh-pages -d dist</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api-reference',
      title: '📡 API Reference',
      icon: <Database className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3">🤖 Gemini AI</h4>
              <div className={codeBlockClass + " space-y-1"}>
                <div>Host: generativelanguage.googleapis.com</div>
                <div>Model: gemini-2.0-flash</div>
                <div>Auth: VITE_GEMINI_API_KEY (.env)</div>
                <div>Use: Tadabbur dzikir, mutiara hikmah</div>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3">🕌 AlAdhan Prayer API</h4>
              <div className={codeBlockClass + " space-y-1"}>
                <div>GET /v1/timings/&#123;date&#125;</div>
                <div>Params: latitude, longitude, method</div>
                <div>Returns: Fajr, Dhuhr, Asr, Maghrib, Isha</div>
                <div>Method 20 = KEMENAG Indonesia</div>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3">📖 Al-Quran Cloud API</h4>
              <div className={codeBlockClass + " space-y-1"}>
                <div>GET /v1/meta → 114 surat metadata</div>
                <div>GET /v1/surah/&#123;n&#125;/editions/</div>
                <div>  quran-uthmani (Arab),</div>
                <div>  id.indonesian (Terjemahan),</div>
                <div>  ar.alafasy (Audio)</div>
              </div>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3">📦 Islamic Network SDK</h4>
              <div className={codeBlockClass + " space-y-1"}>
                <div>SermonsClient → Khutbah Jumat</div>
                <div>  yearSermons(source, year, type)</div>
                <div>BoycottIsraeliClient → Boycott data</div>
                <div>  categories(), brands()</div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h4 className="text-primary font-bold mb-3">🧭 Library: Adhan.js</h4>
            <div className={codeBlockClass + " space-y-1"}>
              <div>import &#123; Qibla &#125; from 'adhan';</div>
              <div>const direction = Qibla(new Coordinates(lat, lng));</div>
              <div>// Returns degrees from North to Ka'bah</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'maintenance',
      title: '🔧 Maintenance & Support',
      icon: <Wrench className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3">🔍 Troubleshooting</h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• <strong>API Key Error</strong> — Periksa .env (VITE_GEMINI_API_KEY)</li>
                <li>• <strong>Build Error</strong> — rm -rf node_modules && npm i</li>
                <li>• <strong>Kompas tidak jalan</strong> — Buka di HP (perlu sensor)</li>
                <li>• <strong>Qur'an kosong</strong> — Cek koneksi ke alquran.cloud</li>
                <li>• <strong>UI Bug</strong> — Hard reload (Ctrl+Shift+R)</li>
              </ul>
            </div>

            <div className={cardClass}>
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Kontribusi
              </h4>
              <ul className={`text-sm ${textClass} space-y-1`}>
                <li>• Fork → branch → PR</li>
                <li>• Laporkan bug via Issues</li>
                <li>• Koreksi ayat/doa sangat diapresiasi</li>
                <li>• npm run lint harus clean sebelum PR</li>
              </ul>
            </div>
          </div>

          <div className={`${cardClass} text-center`}>
            <h4 className="text-primary font-bold mb-2">📧 Contact & Support</h4>
            <p className={textClass}>
              Laporkan kesalahan ayat, bug, atau saran ke{' '}
              <a
                href="mailto:rachdiaaan@gmail.com"
                className="text-primary hover:opacity-80 underline transition-colors font-medium"
              >
                rachdiaaan@gmail.com
              </a>
            </p>
          </div>
        </div>
      )
    }
  ];

  const navigationItems = [
    { id: 'overview', title: 'Overview' },
    { id: 'architecture', title: 'Arsitektur' },
    { id: 'features', title: 'Fitur' },
    { id: 'implementation', title: 'Implementasi' },
    { id: 'installation', title: 'Instalasi' },
    { id: 'api-reference', title: 'API Reference' },
    { id: 'maintenance', title: 'Maintenance' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setSidebarOpen(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Mobile Navigation Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 glass-card p-3 hover:bg-white/20 transition shadow-md"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
      </motion.button>

      <div className="flex">
        {/* Sidebar Navigation */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed lg:sticky top-0 left-0 h-screen w-72 glass-card p-6 z-40 overflow-y-auto no-scrollbar lg:block border-r border-gray-200/30 dark:border-white/5 bg-white/80 dark:bg-slate-900/80"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-primary mb-2">📚 Navigasi Docs</h3>
                <div className={`text-sm ${textClass} ${cardClass}`}>
                  <strong>Versi:</strong> 1.0.0<br />
                  <strong>Update:</strong> 18 Februari 2026<br />
                  <strong>Repo:</strong>{' '}
                  <a href="https://github.com/rachdiaan/reactbadah-new" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    GitHub
                  </a>
                </div>
              </div>

              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${textClass} hover:text-primary hover:bg-primary/5 dark:hover:bg-white/5 transition-colors font-medium text-sm`}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:ml-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 pt-8 lg:pt-0"
          >
            <h1 className="text-3xl font-bold text-primary mb-2">Dokumentasi</h1>
            <p className="text-gray-500 dark:text-gray-400">Panduan lengkap arsitektur, fitur, API, dan cara pengembangan</p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary bg-primary/10 p-2 rounded-lg">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{section.title}</h2>
                </div>

                <div className={textClass}>
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card p-6 text-center mt-8"
          >
            <h3 className="text-2xl font-bold text-primary mb-4">🌟 Sumber Data & Referensi</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { href: 'https://api.alquran.cloud', icon: <Globe className="w-5 h-5" />, name: 'Al-Quran Cloud', desc: 'Qur\'an API' },
                { href: 'https://aladhan.com', icon: <Clock className="w-5 h-5" />, name: 'AlAdhan', desc: 'Prayer Times' },
                { href: 'https://almatsurat.net', icon: <Book className="w-5 h-5" />, name: 'almatsurat.net', desc: 'Referensi Dzikir' },
                { href: 'https://api.islamic.network', icon: <Database className="w-5 h-5" />, name: 'Islamic Network', desc: 'Sermons & Boycott' },
              ].map((src) => (
                <a
                  key={src.name}
                  href={src.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardClass} hover:bg-white/80 dark:hover:bg-slate-700/50 transition-colors group text-center`}
                >
                  <div className="text-primary mx-auto mb-1 w-fit group-hover:scale-110 transition-transform">{src.icon}</div>
                  <div className="text-primary font-semibold text-sm">{src.name}</div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500">{src.desc}</div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentationPage;