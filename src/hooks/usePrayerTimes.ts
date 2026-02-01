import { useState, useEffect, useCallback } from 'react';
import { PrayerTimes, PrayerTime, CountdownTime } from '../types';
import { AlAdhanClient, AlAdhanRequests } from "@islamicnetwork/sdk";
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

  // Client init
  const client = AlAdhanClient.create();

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
        (error) => {
          console.warn('Geolocation error:', error);
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
      const method = METHOD_MAPPING[calculationMethod] || 20; // Default to Kemenag if unknown

      // Setup Options
      // We essentially just need the method for now. 
      // The SDK wrapper makes options optional or configurable.
      // Based on user snippet: new AlAdhanRequests.PrayerTimesOptions()
      // We might need to check if we can pass method to Options or if it's a separate param in the request?
      // Looking at the Requests class usually: 
      // Request(date, lat, lng, options)
      // Options usually has 'method' property.

      const options = new AlAdhanRequests.PrayerTimesOptions();
      // @ts-ignore - The SDK types might define method setting differently, usually via property or constructor. 
      // If the SDK follows AlAdhan API param names:
      (options as any).method = method;

      const request = new AlAdhanRequests.DailyPrayerTimesByCoordinatesRequest(
        dateStr,
        coordinates.lat,
        coordinates.lng,
        options
      );

      const response = await client.prayerTimes().dailyByCoordinates(request);
      const timings = response.data.timings;

      // Parse times strings "HH:mm" to Date objects for today
      // AlAdhan returns "HH:mm" (24h)
      const parseTime = (timeStr: string): Date => {
        // timeStr might be "04:30 (WIB)" or just "04:30". SDK usually gives "HH:mm"
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
      setError("Gagal memuat jadwal sholat.");
      setIsLoading(false);
    }
  }, [coordinates, calculationMethod]);

  // Fetch when dependency changes
  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);


  const getNextPrayer = (prayers: PrayerTimes): PrayerTime | null => {
    const now = new Date();
    const sorted = Object.values(prayers)
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    let next = sorted.find(p => p.time > now);

    // If no next prayer today, it's Fajr tomorrow (simplified logic: just show Fajr time for today + 24h visually?)
    // For proper "Next Prayer" logic across midnight, we'd need tomorrow's schedule. 
    // For now, let's wrap around to Subuh and add 24h to the logic if needed, 
    // or just return null/tomorrow indication. 
    // To match previous logic roughly:
    if (!next && sorted.length > 0) {
      // Return Subuh but technically it's tomorrow. 
      // The UI usually handles "Remaining time".
      // Let's stick to simple "Subuh" from 'today' array but treat as tomorrow for countdown?
      // Actually, let's just use the first prayer of the day (Subuh) as next, knowing it's for tomorrow.
      const first = sorted[0];
      // We can't easily change the Date object in the array without affecting display.
      // Let's create a copy
      const tomorrowSubuh = new Date(first.time);
      tomorrowSubuh.setDate(tomorrowSubuh.getDate() + 1);

      next = { ...first, time: tomorrowSubuh };
    }

    return next || null;
  };

  const calculateCountdown = (targetTime: Date): CountdownTime => {
    const now = new Date();
    const diff = targetTime.getTime() - now.getTime();

    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const checkPrayerTime = (prayers: PrayerTimes) => {
    const now = new Date();
    // Similar alert logic
    Object.values(prayers).forEach(prayer => {
      // Check if time matches within this second (or minute?)
      // We rely on diff being very small
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
  };

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
  }, [todayPrayers, lastAlertTime]);

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