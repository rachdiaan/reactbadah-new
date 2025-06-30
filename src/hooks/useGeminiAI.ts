import { useState } from 'react';

const GEMINI_API_KEY = 'AIzaSyDcZH1x0LFY6uKEYFIyt21RghNTRGMtXTA';

export const useGeminiAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getTadabbur = async (dzikirText: string, translation: string): Promise<string> => {
    if (!GEMINI_API_KEY) {
      return "API key tidak tersedia. Silakan tambahkan VITE_GEMINI_API_KEY ke file .env";
    }

    setIsLoading(true);
    
    try {
      const prompt = `Berikan refleksi (Tadabbur) singkat dalam Bahasa Indonesia, sekitar 80-120 kata, tentang makna dan hikmah dari doa/ayat berikut. Fokus pada relevansinya untuk kehidupan sehari-hari seorang Muslim berdasarkan Al-Qur'an dan hadist shahih. Jangan ulangi teks doa dalam respons. Berikan hikmah yang mendalam dan praktis.

Teks Arab: ${dzikirText}
Terjemahan: ${translation}

Berikan refleksi yang:
1. Berdasarkan Al-Qur'an dan Sunnah
2. Mengandung hikmah praktis untuk kehidupan
3. Menyentuh hati dan menguatkan iman
4. Memberikan motivasi spiritual`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Maaf, terjadi kesalahan saat mengambil refleksi. Silakan coba lagi nanti.";
    } finally {
      setIsLoading(false);
    }
  };

  const getDailyWisdom = async (nextPrayerName?: string): Promise<string> => {
    if (!GEMINI_API_KEY) {
      return "API key tidak tersedia. Silakan tambahkan VITE_GEMINI_API_KEY ke file .env";
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

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates[0]?.content?.parts?.[0]) {
        return result.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Sesungguhnya bersama kesulitan ada kemudahan. Bersabarlah, Allah selalu bersama orang-orang yang sabar.";
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