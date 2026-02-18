import { useState, useRef } from 'react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Simple in-memory cache to avoid repeated API calls for the same text
const tadabburCache = new Map<string, string>();
const wisdomCache: { text: string; timestamp: number } | null = null;
let lastWisdom = wisdomCache;

// Rate limiter: at most 1 request every 2 seconds
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000;

async function callGeminiWithRetry(prompt: string, maxRetries = 3): Promise<string> {
  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 256,
            topP: 0.9,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          ]
        })
      });

      if (response.status === 429) {
        // Rate limited — wait and retry with exponential backoff
        const waitTime = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s
        console.warn(`Gemini rate limited (attempt ${attempt + 1}). Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (response.status === 503) {
        // Service unavailable — brief retry
        await new Promise(resolve => setTimeout(resolve, 1500));
        continue;
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody?.error?.message || `HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
      }

      // Check if blocked by safety filters
      if (result.candidates?.[0]?.finishReason === 'SAFETY') {
        return "Konten ini tidak dapat dianalisis oleh AI saat ini. Silakan baca dan renungi maknanya secara langsung.";
      }

      throw new Error("Respons AI tidak valid");
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      // Network error — brief wait then retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error("Semua percobaan gagal");
}

export const useGeminiAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(false);

  const getTadabbur = async (dzikirText: string, translation: string): Promise<string> => {
    if (!GEMINI_API_KEY) {
      return "API key tidak tersedia. Silakan tambahkan VITE_GEMINI_API_KEY ke file .env";
    }

    // Check cache first
    const cacheKey = `${dzikirText.substring(0, 50)}_${translation.substring(0, 50)}`;
    if (tadabburCache.has(cacheKey)) {
      return tadabburCache.get(cacheKey)!;
    }

    setIsLoading(true);
    abortRef.current = false;

    try {
      const prompt = `Berikan refleksi (Tadabbur) singkat dalam Bahasa Indonesia, sekitar 80-120 kata, tentang makna dan hikmah dari doa/ayat berikut. Fokus pada relevansinya untuk kehidupan sehari-hari seorang Muslim berdasarkan Al-Qur'an dan hadist shahih. Jangan ulangi teks doa dalam respons. Berikan hikmah yang mendalam dan praktis.

Teks Arab: ${dzikirText}
Terjemahan: ${translation}

Berikan refleksi yang:
1. Berdasarkan Al-Qur'an dan Sunnah
2. Mengandung hikmah praktis untuk kehidupan
3. Menyentuh hati dan menguatkan iman
4. Memberikan motivasi spiritual`;

      const text = await callGeminiWithRetry(prompt);

      if (!abortRef.current) {
        tadabburCache.set(cacheKey, text);
      }
      return text;
    } catch (error) {
      console.error("Gemini Tadabbur Error:", error);
      const msg = (error as Error).message || '';

      if (msg.includes('429') || msg.includes('quota')) {
        return "⏳ Kuota API sementara habis. Coba lagi dalam beberapa menit. Fitur AI menggunakan kuota gratis yang terbatas per menit.";
      }
      if (msg.includes('403') || msg.includes('API key')) {
        return "🔑 API key tidak valid atau tidak aktif. Hubungi developer.";
      }
      return "Maaf, terjadi kesalahan saat mengambil refleksi. Silakan coba lagi dalam beberapa saat.";
    } finally {
      setIsLoading(false);
    }
  };

  const getDailyWisdom = async (nextPrayerName?: string): Promise<string> => {
    if (!GEMINI_API_KEY) {
      return "API key tidak tersedia. Silakan tambahkan VITE_GEMINI_API_KEY ke file .env";
    }

    // Check cache (reuse for 10 minutes)
    if (lastWisdom && Date.now() - lastWisdom.timestamp < 10 * 60 * 1000) {
      return lastWisdom.text;
    }

    setIsLoading(true);

    try {
      const timeContext = nextPrayerName ? `Saat ini mendekati waktu ${nextPrayerName}.` : '';
      const prompt = `Berikan satu mutiara hikmah Islami yang indah dan menyentuh hati, berdasarkan Al-Qur'an dan hadist shahih. ${timeContext} 

Berikan hikmah yang:
1. Berdasarkan dalil yang kuat dari Al-Qur'an atau hadist shahih
2. Relevan dengan kondisi spiritual seorang Muslim
3. Memberikan motivasi dan ketenangan hati
4. Menggunakan bahasa yang indah dan mudah dipahami
5. Panjang 2-3 kalimat dalam Bahasa Indonesia

Fokus pada tema: ketaqwaan, syukur, sabar, tawakkal, atau cinta kepada Allah.`;

      const text = await callGeminiWithRetry(prompt);
      lastWisdom = { text, timestamp: Date.now() };
      return text;
    } catch (error) {
      console.error("Gemini Wisdom Error:", error);
      // Return a local fallback instead of showing error
      const fallbacks = [
        "Sesungguhnya bersama kesulitan ada kemudahan. (QS. Al-Insyirah: 6)",
        "Barangsiapa bertawakkal kepada Allah, maka Allah akan memberinya kecukupan. (QS. At-Talaq: 3)",
        "Dan bersabarlah, sesungguhnya Allah bersama orang-orang yang sabar. (QS. Al-Anfal: 46)",
        "Maka nikmat Tuhanmu yang manakah yang kamu dustakan? (QS. Ar-Rahman: 13)",
        "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram. (QS. Ar-Ra'd: 28)",
      ];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getTadabbur,
    getDailyWisdom,
    isLoading
  };
};