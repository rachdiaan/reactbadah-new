import { useState, useEffect } from 'react';
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

  // Settings State
  const [calculationMethod, setCalculationMethod] = useState(() => {
    return localStorage.getItem('prayerCalculationMethod') || 'kemenag';
  });
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDINATES);
  const [locationName, setLocationName] = useState('Jakarta'); // Default

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
          setLocationName('Current Location'); // or reverse geocode if needed
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Keep default (Jakarta)
        }
      );
    }
  }, []);

  const getPrayerTimesForDate = (date: Date): PrayerTimes | null => {
    const times = calculatePrayerTimes(date, coordinates.lat, coordinates.lng, calculationMethod);

    if (!times) return null;

    const prayerNameMapping = {
      subuh: 'Subuh',
      dzuhur: 'Dzuhur',
      ashar: 'Ashar',
      maghrib: 'Maghrib',
      isya: 'Isya'
    };

    const result: PrayerTimes = {};

    (Object.keys(prayerNameMapping) as Array<keyof typeof prayerNameMapping>).forEach((key) => {
      result[key] = {
        name: prayerNameMapping[key],
        time: times[key],
        key
      };
    });

    return result;
  };

  const getNextPrayer = (): PrayerTime | null => {
    const now = new Date();
    // Re-calculate for strict accuracy or use state if updated frequently
    const todayTimings = getPrayerTimesForDate(now);

    if (!todayTimings) return null;

    const sortedTimings = Object.values(todayTimings)
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    let next = sortedTimings.find(p => p.time > now);

    if (!next) {
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      const tomorrowTimings = getPrayerTimesForDate(tomorrow);

      if (tomorrowTimings) {
        next = Object.values(tomorrowTimings)
          .sort((a, b) => a.time.getTime() - b.time.getTime())[0];
      }
    }

    return next || null;
  };

  const calculateCountdown = (targetTime: Date): CountdownTime => {
    const now = new Date();
    const diff = targetTime.getTime() - now.getTime();

    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const checkPrayerTime = (prayers: PrayerTimes) => {
    const now = new Date();

    Object.values(prayers).forEach(prayer => {
      const timeDiff = now.getTime() - prayer.time.getTime();
      // Match original alert logic: within 5 seconds
      if (timeDiff >= 0 && timeDiff <= 5000 && lastAlertTime !== prayer.time.getTime()) {
        setAlertPrayer(prayer);
        setShowPrayerAlert(true);
        setLastAlertTime(prayer.time.getTime());

        setTimeout(() => {
          setShowPrayerAlert(false);
          setAlertPrayer(null);
        }, 5000);
      }
    });
  };

  // Main Loop
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);

      const prayers = getPrayerTimesForDate(now);
      if (prayers) {
        setTodayPrayers(prayers);
        checkPrayerTime(prayers);
      }

      const next = getNextPrayer();
      setNextPrayer(next);

      if (next) {
        setCountdown(calculateCountdown(next.time));
      }
    };

    updateTime(); // Initial call
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [coordinates, calculationMethod, lastAlertTime]); // Re-create interval if settings change to ensure fresh calculation context

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
    // New exports
    calculationMethod,
    changeMethod,
    availableMethods: CALCULATION_METHODS,
    locationName
  };
};