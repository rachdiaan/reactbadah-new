import { useState, useEffect, useCallback } from 'react';
import { PrayerTimes, PrayerTime, CountdownTime } from '../types';
import { format } from 'date-fns';

const DEFAULT_COORDINATES = {
  lat: -6.2088,
  lng: 106.8456
};

const METHOD_MAPPING: Record<string, number> = {
  'kemenag': 20,
  'mwl': 3,
  'egypt': 5,
  'makkah': 4,
  'karachi': 1,
  'tehran': 7,
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

  const [calculationMethod, setCalculationMethod] = useState(() =>
    localStorage.getItem('prayerCalculationMethod') || 'kemenag'
  );
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDINATES);
  const [locationName, setLocationName] = useState('Jakarta');

  const changeMethod = (methodId: string) => {
    setCalculationMethod(methodId);
    localStorage.setItem('prayerCalculationMethod', methodId);
  };

  useEffect(() => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationName('Lokasi Saat Ini');
      },
      () => setLocationName('Jakarta (Default)')
    );
  }, []);

  const fetchPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const dateStr = format(new Date(), 'dd-MM-yyyy');
      const method = METHOD_MAPPING[calculationMethod] ?? 20;
      const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${coordinates.lat}&longitude=${coordinates.lng}&method=${method}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (!result?.data?.timings) throw new Error('Invalid response');

      const timings: AlAdhanTimings = result.data.timings;

      const parseTime = (timeStr: string): Date => {
        const [hours, minutes] = timeStr.split(' ')[0].split(':').map(Number);
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
      };

      setTodayPrayers({
        subuh:   { name: 'Subuh',   time: parseTime(timings.Fajr),    key: 'subuh'   },
        dzuhur:  { name: 'Dzuhur',  time: parseTime(timings.Dhuhr),   key: 'dzuhur'  },
        ashar:   { name: 'Ashar',   time: parseTime(timings.Asr),     key: 'ashar'   },
        maghrib: { name: 'Maghrib', time: parseTime(timings.Maghrib), key: 'maghrib' },
        isya:    { name: 'Isya',    time: parseTime(timings.Isha),    key: 'isya'    },
      });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'The user aborted a request.' || msg?.includes('abort')) {
        setError('Koneksi timeout. Periksa internet lalu refresh.');
      } else {
        setError('Gagal memuat jadwal sholat. Periksa koneksi internet.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [coordinates, calculationMethod]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  const getNextPrayer = useCallback((prayers: PrayerTimes): PrayerTime | null => {
    const now = new Date();
    const sorted = Object.values(prayers).sort((a, b) => a.time.getTime() - b.time.getTime());
    let next = sorted.find(p => p.time > now);
    if (!next && sorted.length > 0) {
      const first = sorted[0];
      const tomorrow = new Date(first.time);
      tomorrow.setDate(tomorrow.getDate() + 1);
      next = { ...first, time: tomorrow };
    }
    return next || null;
  }, []);

  const calculateCountdown = useCallback((targetTime: Date): CountdownTime => {
    const diff = targetTime.getTime() - new Date().getTime();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours:   Math.floor(diff / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    };
  }, []);

  const checkPrayerTime = useCallback((prayers: PrayerTimes) => {
    const now = new Date();
    const todayKey = now.toDateString();
    Object.values(prayers).forEach(prayer => {
      const prayerTs = prayer.time.getTime();
      const diff = now.getTime() - prayerTs;
      if (diff >= 0 && diff < 60_000) {
        const alertKey = `alerted_${todayKey}_${prayer.key}`;
        if (!localStorage.getItem(alertKey) && lastAlertTime !== prayerTs) {
          localStorage.setItem(alertKey, '1');
          setAlertPrayer(prayer);
          setShowPrayerAlert(true);
          setLastAlertTime(prayerTs);
          setTimeout(() => { setShowPrayerAlert(false); setAlertPrayer(null); }, 8000);
        }
      }
    });
  }, [lastAlertTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (Object.keys(todayPrayers).length > 0) {
        checkPrayerTime(todayPrayers);
        const next = getNextPrayer(todayPrayers);
        setNextPrayer(next);
        if (next) setCountdown(calculateCountdown(next.time));
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
    dismissAlert: () => { setShowPrayerAlert(false); setAlertPrayer(null); },
    calculationMethod,
    changeMethod,
    availableMethods: [
      { id: 'kemenag', name: 'Kemenag RI' },
      { id: 'mwl',     name: 'Muslim World League' },
      { id: 'egypt',   name: 'Egyptian General Auth' },
      { id: 'makkah',  name: 'Umm al-Qura' },
      { id: 'karachi', name: 'Karachi' },
      { id: 'tehran',  name: 'Tehran' },
    ],
    locationName,
    isLoading,
    error,
    retry: fetchPrayerTimes,
  };
};
