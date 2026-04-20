import { useState, useEffect, useCallback } from 'react';
import { PrayerTimes, PrayerTime, CountdownTime } from '../types';
import { calculatePrayerTimes, CALCULATION_METHODS } from '../utils/prayerCalculation';

const DEFAULT_COORDINATES = {
  lat: -6.2088, // Jakarta
  lng: 106.8456
};

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

  const fetchPrayerTimes = useCallback(() => {
    setIsLoading(true);
    setError(null);
    try {
      const result = calculatePrayerTimes(new Date(), coordinates.lat, coordinates.lng, calculationMethod);
      if (!result) throw new Error('Calculation failed');

      const newPrayers: PrayerTimes = {
        subuh:   { name: 'Subuh',   time: result.subuh,   key: 'subuh'   },
        dzuhur:  { name: 'Dzuhur',  time: result.dzuhur,  key: 'dzuhur'  },
        ashar:   { name: 'Ashar',   time: result.ashar,   key: 'ashar'   },
        maghrib: { name: 'Maghrib', time: result.maghrib, key: 'maghrib' },
        isya:    { name: 'Isya',    time: result.isya,    key: 'isya'    },
      };

      setTodayPrayers(newPrayers);
    } catch (err) {
      console.error('Prayer time calculation failed:', err);
      setError('Gagal menghitung jadwal sholat.');
    } finally {
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
    const todayKey = now.toDateString();

    Object.values(prayers).forEach(prayer => {
      const prayerTs = prayer.time.getTime();
      const diff = now.getTime() - prayerTs;

      // Trigger if we passed prayer time within last 60 seconds
      if (diff >= 0 && diff < 60_000) {
        // Use localStorage key so we only alert once per prayer per day
        const alertKey = `alerted_${todayKey}_${prayer.key}`;
        if (!localStorage.getItem(alertKey) && lastAlertTime !== prayerTs) {
          localStorage.setItem(alertKey, '1');
          setAlertPrayer(prayer);
          setShowPrayerAlert(true);
          setLastAlertTime(prayerTs);

          setTimeout(() => {
            setShowPrayerAlert(false);
            setAlertPrayer(null);
          }, 8000);
        }
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
    availableMethods: CALCULATION_METHODS.map(m => ({ id: m.id, name: m.name })),
    locationName,
    isLoading,
    error
  };
};