import { useState, useEffect, useCallback } from 'react';
import { PrayerTimes, PrayerTime, CountdownTime } from '../types';
import { format } from 'date-fns';

const DEFAULT_COORDINATES = {
  lat: -6.2088, // Jakarta
  lng: 106.8456
};

// Method Mapping for AlAdhan
const METHOD_MAPPING: Record<string, number> = {
  'kemenag': 20, // Indonesia (Kemenag)
  'mwl': 3,      // Muslim World League
  'egypt': 5,    // Egyptian General Authority
  'makkah': 4,   // Umm al-Qura
  'karachi': 1,  // Karachi
  'tehran': 7,   // Tehran
  'jafari': 0,   // Shia Ithna-Ashari
};

interface AlAdhanTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export const usePrayerTimes = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 });
  const [todayPrayers, setTodayPrayers] = useState<PrayerTimes>({});

  const [showPrayerAlert, setShowPrayerAlert] = useState(false);
  const [alertPrayer, setAlertPrayer] = useState<PrayerTime | null>(null);
  const [lastAlertTime, setLastAlertTime] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings State
  const [calculationMethod, setCalculationMethod] = useState(() => {
    return localStorage.getItem('prayerCalculationMethod') || 'kemenag';
  });
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDINATES);
  const [locationName, setLocationName] = useState('Jakarta');

  // Update method and persist
  const changeMethod = (methodId: string) => {
    setCalculationMethod(methodId);
    localStorage.setItem('prayerCalculationMethod', methodId);
  };

  // Get Location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationName('Lokasi Saat Ini');
        },
        (geoError) => {
          console.warn('Geolocation error:', geoError);
          setLocationName('Jakarta (Default)');
        }
      );
    }
  }, []);

  const fetchPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dateStr = format(new Date(), 'dd-MM-yyyy');
      const method = METHOD_MAPPING[calculationMethod] ?? 20;

      const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${coordinates.lat}&longitude=${coordinates.lng}&method=${method}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (!result || !result.data || !result.data.timings) {
        throw new Error("Invalid response from API");
      }

      const timings: AlAdhanTimings = result.data.timings;

      // Parse AlAdhan "HH:mm" strings to Date objects for today
      const parseTime = (timeStr: string): Date => {
        const cleanTime = timeStr.split(' ')[0];
        const [hours, minutes] = cleanTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      };

      const newPrayers: PrayerTimes = {
        subuh: { name: 'Subuh', time: parseTime(timings.Fajr), key: 'subuh' },
        dzuhur: { name: 'Dzuhur', time: parseTime(timings.Dhuhr), key: 'dzuhur' },
        ashar: { name: 'Ashar', time: parseTime(timings.Asr), key: 'ashar' },
        maghrib: { name: 'Maghrib', time: parseTime(timings.Maghrib), key: 'maghrib' },
        isya: { name: 'Isya', time: parseTime(timings.Isha), key: 'isya' },
      };

      setTodayPrayers(newPrayers);
      setIsLoading(false);

    } catch (err) {
      console.error("Failed to fetch prayer times:", err);
      setError("Gagal memuat jadwal sholat. Periksa koneksi internet Anda.");
      setIsLoading(false);
    }
  }, [coordinates, calculationMethod]);

  // Fetch when dependency changes
  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);


  const getNextPrayer = useCallback((prayers: PrayerTimes): PrayerTime | null => {
    const now = new Date();
    const sorted = Object.values(prayers)
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    let next = sorted.find(p => p.time > now);

    if (!next && sorted.length > 0) {
      const first = sorted[0];
      const tomorrowSubuh = new Date(first.time);
      tomorrowSubuh.setDate(tomorrowSubuh.getDate() + 1);
      next = { ...first, time: tomorrowSubuh };
    }

    return next || null;
  }, []);

  const calculateCountdown = useCallback((targetTime: Date): CountdownTime => {
    const now = new Date();
    const diff = targetTime.getTime() - now.getTime();

    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }, []);

  const checkPrayerTime = useCallback((prayers: PrayerTimes) => {
    const now = new Date();
    Object.values(prayers).forEach(prayer => {
      const diff = Math.abs(now.getTime() - prayer.time.getTime());

      // If we are within 5 seconds of the time and haven't alerted yet
      if (diff < 5000 && lastAlertTime !== prayer.time.getTime()) {
        setAlertPrayer(prayer);
        setShowPrayerAlert(true);
        setLastAlertTime(prayer.time.getTime());

        setTimeout(() => {
          setShowPrayerAlert(false);
          setAlertPrayer(null);
        }, 5000); // Auto dismiss
      }
    });
  }, [lastAlertTime]);

  // Timer Loop (Clock & Countdown)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (todayPrayers && Object.keys(todayPrayers).length > 0) {
        checkPrayerTime(todayPrayers);

        const next = getNextPrayer(todayPrayers);
        setNextPrayer(next);

        if (next) {
          setCountdown(calculateCountdown(next.time));
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [todayPrayers, checkPrayerTime, getNextPrayer, calculateCountdown]);

  return {
    currentTime,
    nextPrayer,
    countdown,
    todayPrayers,
    showPrayerAlert,
    alertPrayer,
    dismissAlert: () => {
      setShowPrayerAlert(false);
      setAlertPrayer(null);
    },
    calculationMethod,
    changeMethod,
    availableMethods: [
      { id: 'kemenag', name: 'Kemenag RI' },
      { id: 'mwl', name: 'Muslim World League' },
      { id: 'egypt', name: 'Egyptian General Auth' },
      { id: 'makkah', name: 'Umm al-Qura' },
      { id: 'karachi', name: 'Karachi' },
    ],
    locationName,
    isLoading,
    error
  };
};