import { useState, useEffect } from 'react';
import { PrayerTimes, PrayerTime, CountdownTime } from '../types';
import { prayerData } from '../data/prayerData';

export const usePrayerTimes = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0 });
  const [todayPrayers, setTodayPrayers] = useState<PrayerTimes>({});
  const [showPrayerAlert, setShowPrayerAlert] = useState(false);
  const [alertPrayer, setAlertPrayer] = useState<PrayerTime | null>(null);
  const [lastAlertTime, setLastAlertTime] = useState<number | null>(null);

  const getPrayerTimes = (date: Date): PrayerTimes | null => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthData = prayerData[String(month)];
    
    if (!monthData) return null;
    
    const todayData = monthData.find(d => parseInt(d.tanggal) === day);
    if (!todayData) return null;

    const prayerNameMapping = {
      subuh: 'Subuh',
      dzuhur: 'Dzuhur', 
      ashar: 'Ashar',
      maghrib: 'Maghrib',
      isya: 'Isya'
    };

    const timings: PrayerTimes = {};
    
    Object.entries(prayerNameMapping).forEach(([key, name]) => {
      const timeStr = todayData[key as keyof typeof todayData] as string;
      const [hour, minute] = timeStr.split(':');
      const prayerDate = new Date(date);
      prayerDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
      
      timings[key] = {
        name,
        time: prayerDate,
        key
      };
    });

    return timings;
  };

  const getNextPrayer = (): PrayerTime | null => {
    const now = new Date();
    const todayTimings = getPrayerTimes(now);
    
    if (!todayTimings) return null;

    const sortedTimings = Object.values(todayTimings)
      .sort((a, b) => a.time.getTime() - b.time.getTime());

    let nextPrayer = sortedTimings.find(p => p.time > now);

    if (!nextPrayer) {
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      const tomorrowTimings = getPrayerTimes(tomorrow);
      
      if (tomorrowTimings) {
        nextPrayer = Object.values(tomorrowTimings)
          .sort((a, b) => a.time.getTime() - b.time.getTime())[0];
      }
    }

    return nextPrayer;
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

  const checkPrayerTime = () => {
    const now = new Date();
    const prayers = getPrayerTimes(now);
    
    if (!prayers) return;

    // Check if any prayer time has arrived (within 5 seconds)
    Object.values(prayers).forEach(prayer => {
      const timeDiff = now.getTime() - prayer.time.getTime();
      
      // If prayer time just arrived (within 5 seconds) and we haven't shown alert for this time
      if (timeDiff >= 0 && timeDiff <= 5000 && lastAlertTime !== prayer.time.getTime()) {
        setAlertPrayer(prayer);
        setShowPrayerAlert(true);
        setLastAlertTime(prayer.time.getTime());
        
        // Auto hide after 5 seconds
        setTimeout(() => {
          setShowPrayerAlert(false);
          setAlertPrayer(null);
        }, 5000);
      }
    });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const prayers = getPrayerTimes(now);
      if (prayers) {
        setTodayPrayers(prayers);
      }

      const next = getNextPrayer();
      setNextPrayer(next);
      
      if (next) {
        setCountdown(calculateCountdown(next.time));
      }

      // Check for prayer time alerts
      checkPrayerTime();
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [lastAlertTime]);

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
    }
  };
};