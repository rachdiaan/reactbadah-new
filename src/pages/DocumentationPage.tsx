import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, 
  Code, 
  Sparkles, 
  Clock, 
  Smartphone, 
  Database, 
  Zap, 
  Shield, 
  Globe, 
  Heart,
  Settings,
  Users,
  Target,
  Layers,
  GitBranch,
  Server,
  Monitor,
  Wrench,
  Menu,
  X
} from 'lucide-react';

const DocumentationPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    {
      id: 'overview',
      title: '🚀 Overview Aplikasi',
      icon: <Sparkles className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            <strong>Al-Ma'tsurat Sugro</strong> adalah aplikasi Progressive Web App (PWA) modern yang dirancang khusus untuk memperkaya pengalaman spiritual harian umat Muslim. Aplikasi ini mengintegrasikan amalan dzikir Al-Ma'tsurat dengan sistem jadwal shalat yang akurat, dilengkapi dengan teknologi AI untuk memberikan refleksi spiritual yang mendalam.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-2">🎯 Keunggulan Utama</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Dzikir Lengkap Al-Ma'tsurat</li>
                <li>• AI-Powered Tadabbur</li>
                <li>• Real-time Prayer Times</li>
                <li>• Modern UI/UX Design</li>
                <li>• Progressive Web App</li>
              </ul>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-blue-300 font-semibold mb-2">👥 Target Pengguna</h4>
              <ul className="text-sm text-slate-300 space-y-1">
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
          <p className="text-slate-300 leading-relaxed">
            Aplikasi dibangun menggunakan teknologi modern yang terbukti reliable dan performant dengan arsitektur yang modular dan scalable.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Frontend
              </h4>
              <div className="flex flex-wrap gap-1">
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">React 18</span>
                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">TypeScript</span>
                <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Vite</span>
                <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs">Tailwind</span>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">Framer Motion</span>
              </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI & APIs
              </h4>
              <div className="flex flex-wrap gap-1">
                <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs">Gemini AI</span>
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded text-xs">Prayer API</span>
                <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs">Date-fns</span>
              </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Design
              </h4>
              <div className="flex flex-wrap gap-1">
                <span className="bg-pink-500/20 text-pink-300 px-2 py-1 rounded text-xs">Liquid Glass</span>
                <span className="bg-teal-500/20 text-teal-300 px-2 py-1 rounded text-xs">Responsive</span>
                <span className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded text-xs">Dark Theme</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Sistem Jadwal Shalat
              </h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Data lengkap 12 bulan untuk Bandung</li>
                <li>• Real-time clock dengan countdown</li>
                <li>• Visual highlighting waktu shalat</li>
                <li>• Auto notification system</li>
                <li>• Akurasi tinggi dari Radio Adzan FM</li>
              </ul>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3 flex items-center gap-2">
                <Book className="w-4 h-4" />
                Dzikir Al-Ma'tsurat
              </h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Ta'awudz hingga Doa Rabithah</li>
                <li>• Tap counter dengan progress bar</li>
                <li>• Arabic typography yang indah</li>
                <li>• Transliterasi dan terjemahan</li>
                <li>• Completion status indicator</li>
              </ul>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Tadabbur
              </h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Google Gemini 2.0 Flash</li>
                <li>• Contextual analysis mendalam</li>
                <li>• Berdasarkan Al-Qur'an & Hadist</li>
                <li>• Personalized reflection</li>
                <li>• Bahasa Indonesia yang indah</li>
              </ul>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                UI/UX Design
              </h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Liquid glass effect</li>
                <li>• Gradient animation background</li>
                <li>• Micro-interactions</li>
                <li>• Responsive layout</li>
                <li>• Color palette yang menenangkan</li>
              </ul>
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
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3">🎣 Custom Hooks</h4>
              <div className="bg-black/30 p-3 rounded-lg text-xs font-mono text-green-300">
                <div>usePrayerTimes() - Jadwal shalat</div>
                <div>useGeminiAI() - Integrasi AI</div>
              </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3">📊 State Management</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• useState untuk local state</li>
                <li>• useEffect untuk side effects</li>
                <li>• Custom hooks untuk logic kompleks</li>
              </ul>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3">🔗 API Integration</h4>
              <div className="bg-black/30 p-3 rounded-lg text-xs font-mono text-blue-300">
                <div>Gemini AI - Tadabbur & Hikmah</div>
                <div>Prayer Data - Jadwal Shalat</div>
              </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3">⚡ Performance</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Code splitting & lazy loading</li>
                <li>• React.memo & useMemo</li>
                <li>• Debouncing untuk API calls</li>
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
          <div className="bg-black/20 p-4 rounded-xl">
            <h4 className="text-yellow-300 font-semibold mb-3">💻 System Requirements</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="text-slate-300">
                <div className="font-semibold text-blue-300">Node.js</div>
                <div>v18.0.0+</div>
              </div>
              <div className="text-slate-300">
                <div className="font-semibold text-green-300">npm</div>
                <div>v8.0.0+</div>
              </div>
              <div className="text-slate-300">
                <div className="font-semibold text-orange-300">Browser</div>
                <div>Modern</div>
              </div>
              <div className="text-slate-300">
                <div className="font-semibold text-purple-300">OS</div>
                <div>Cross-platform</div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 p-4 rounded-xl">
            <h4 className="text-yellow-300 font-semibold mb-3">🛠️ Setup Development</h4>
            <div className="bg-black/30 p-3 rounded-lg text-sm font-mono text-green-300 space-y-1">
              <div>git clone https://github.com/username/al-matsurat-app.git</div>
              <div>cd al-matsurat-app</div>
              <div>npm install</div>
              <div>cp .env.example .env</div>
              <div>npm run dev</div>
            </div>
          </div>
          
          <div className="bg-black/20 p-4 rounded-xl">
            <h4 className="text-yellow-300 font-semibold mb-3">☁️ Deployment Options</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-black/30 p-3 rounded-lg text-center">
                <div className="text-blue-300 font-semibold">Vercel</div>
                <div className="text-xs text-slate-400">Auto deploy</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg text-center">
                <div className="text-green-300 font-semibold">Netlify</div>
                <div className="text-xs text-slate-400">Static hosting</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg text-center">
                <div className="text-orange-300 font-semibold">Firebase</div>
                <div className="text-xs text-slate-400">Google Cloud</div>
              </div>
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
          <div className="bg-black/20 p-4 rounded-xl">
            <h4 className="text-yellow-300 font-semibold mb-3">🤖 Gemini AI API</h4>
            <div className="bg-black/30 p-3 rounded-lg text-xs font-mono text-blue-300">
              <div>Endpoint: generativelanguage.googleapis.com</div>
              <div>Model: gemini-2.0-flash</div>
              <div>Method: POST</div>
              <div>Content-Type: application/json</div>
            </div>
          </div>
          
          <div className="bg-black/20 p-4 rounded-xl">
            <h4 className="text-yellow-300 font-semibold mb-3">🕌 Prayer Data Structure</h4>
            <div className="bg-black/30 p-3 rounded-lg text-xs font-mono text-green-300">
              <div>interface PrayerTime &#123;</div>
              <div>&nbsp;&nbsp;name: string;</div>
              <div>&nbsp;&nbsp;time: Date;</div>
              <div>&nbsp;&nbsp;key: string;</div>
              <div>&#125;</div>
            </div>
          </div>
          
          <div className="bg-black/20 p-4 rounded-xl">
            <h4 className="text-yellow-300 font-semibold mb-3">⚠️ Error Handling</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• API Rate Limit - Retry mechanism</li>
              <li>• Network Error - Fallback ke data lokal</li>
              <li>• Invalid Response - User-friendly message</li>
              <li>• Timeout - Loading state handling</li>
            </ul>
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
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3">🔍 Troubleshooting</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• API Key Error - Periksa validitas key</li>
                <li>• Build Error - Clear node_modules</li>
                <li>• Performance Issue - Check dev tools</li>
                <li>• UI Bug - Clear browser cache</li>
              </ul>
            </div>
            
            <div className="bg-black/20 p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-3">📅 Update Schedule</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Monthly - Dependencies update</li>
                <li>• Quarterly - Feature updates</li>
                <li>• Annually - Major version updates</li>
                <li>• As needed - Security patches</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-black/20 p-4 rounded-xl">
            <h4 className="text-yellow-300 font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Contributing Guidelines
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
              <div className="bg-black/30 p-3 rounded-lg text-center">
                <div className="text-blue-300 font-semibold">1. Fork</div>
                <div className="text-xs text-slate-400">Repository</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg text-center">
                <div className="text-green-300 font-semibold">2. Branch</div>
                <div className="text-xs text-slate-400">Create new</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg text-center">
                <div className="text-yellow-300 font-semibold">3. Code</div>
                <div className="text-xs text-slate-400">Follow standards</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg text-center">
                <div className="text-purple-300 font-semibold">4. Test</div>
                <div className="text-xs text-slate-400">All passing</div>
              </div>
              <div className="bg-black/30 p-3 rounded-lg text-center">
                <div className="text-pink-300 font-semibold">5. PR</div>
                <div className="text-xs text-slate-400">Submit</div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 p-4 rounded-xl text-center">
            <h4 className="text-yellow-300 font-semibold mb-2">📧 Contact & Support</h4>
            <p className="text-slate-300">
              Untuk pertanyaan atau saran, hubungi{' '}
              <a 
                href="mailto:rachdiaaan@gmail.com" 
                className="text-blue-300 hover:text-blue-200 underline transition-colors"
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
    <div className="relative">
      {/* Mobile Navigation Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 glass-card p-3 hover:bg-white/20 transition"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
      </motion.button>

      <div className="flex">
        {/* Sidebar Navigation */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed lg:sticky top-0 left-0 h-screen w-80 glass-card p-6 z-40 overflow-y-auto lg:block"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">📚 Navigasi</h3>
                <div className="text-sm text-slate-400 bg-black/20 p-2 rounded-lg">
                  <strong>Versi:</strong> 3.1.5<br />
                  <strong>Update:</strong> 30 Juni 2025
                </div>
              </div>
              
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:ml-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4">📚 Dokumentasi Lengkap</h1>
            <p className="text-xl text-slate-300">Al-Ma'tsurat & Jadwal Shalat</p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-yellow-300">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
                
                <div className="text-slate-300">
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
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">🌟 Sumber Data & Referensi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="https://quran.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/20 p-4 rounded-xl hover:bg-black/30 transition-colors group"
              >
                <Globe className="w-6 h-6 text-blue-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-blue-300 font-semibold">quran.com</div>
                <div className="text-xs text-slate-400">Al-Qur'an Digital</div>
              </a>
              
              <a 
                href="https://almatsurat.net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/20 p-4 rounded-xl hover:bg-black/30 transition-colors group"
              >
                <Book className="w-6 h-6 text-green-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-green-300 font-semibold">almatsurat.net</div>
                <div className="text-xs text-slate-400">Referensi Dzikir</div>
              </a>
              
              <a 
                href="https://radioadzanfmbandung.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/20 p-4 rounded-xl hover:bg-black/30 transition-colors group"
              >
                <Clock className="w-6 h-6 text-orange-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-orange-300 font-semibold">Radio Adzan FM</div>
                <div className="text-xs text-slate-400">Jadwal Shalat Bandung</div>
              </a>
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
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentationPage;