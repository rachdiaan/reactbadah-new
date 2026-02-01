import { Coordinates, CalculationMethod, PrayerTimes, CalculationParameters, Madhab } from 'adhan';

export interface PrayerTimeResult {
  subuh: Date;
  dzuhur: Date;
  ashar: Date;
  maghrib: Date;
  isya: Date;
}

export const CALCULATION_METHODS = [
  { id: 'kemenag', name: 'Kemenag RI', description: 'Kementerian Agama Republik Indonesia' },
  { id: 'umm_al_qura', name: 'Umm Al-Qura', description: 'Umm Al-Qura University, Makkah' },
  { id: 'mwl', name: 'MWL', description: 'Muslim World League' },
  { id: 'isna', name: 'ISNA', description: 'Islamic Society of North America' },
  { id: 'egyptian', name: 'Egyptian', description: 'Egyptian General Authority of Survey' },
  { id: 'karachi', name: 'Karachi', description: 'University of Islamic Sciences, Karachi' },
  { id: 'tehran', name: 'Tehran', description: 'Institute of Geophysics, University of Tehran' },
  { id: 'muhammadiyah', name: 'Muhammadiyah', description: 'Muhammadiyah Majlis Tarjih, Indonesia' },
];

export const getCalculationParameters = (methodId: string): CalculationParameters => {
  switch (methodId) {
    case 'kemenag':
      // Kemenag RI: Fajr 20, Isya 18
      const paramsKemenag = new CalculationParameters('Kemenag', 20, 18);
      // Optional: Adjust adjustments if needed, usually Kemenag has specific minutes added
      // But standard 20/18 is the core.
      return paramsKemenag;
      
    case 'muhammadiyah':
        // Muhammadiyah: Fajr 18, Isya 18 (Sesuai Putusan Tarjih 2021)
      const paramsMuhammadiyah = new CalculationParameters('Muhammadiyah', 18, 18);
      return paramsMuhammadiyah;

    case 'umm_al_qura':
      return CalculationMethod.UmmAlQura();
    case 'mwl':
      return CalculationMethod.MuslimWorldLeague();
    case 'isna':
      return CalculationMethod.NorthAmerica();
    case 'egyptian':
      return CalculationMethod.Egyptian();
    case 'karachi':
      return CalculationMethod.Karachi();
    case 'tehran':
      return CalculationMethod.Tehran();
    default:
      return new CalculationParameters('Kemenag', 20, 18); // Default to Kemenag
  }
};

export const calculatePrayerTimes = (
  date: Date,
  lat: number,
  lng: number,
  methodId: string = 'kemenag'
): PrayerTimeResult | null => {
  try {
    const coordinates = new Coordinates(lat, lng);
    const params = getCalculationParameters(methodId);
    
    // Set Madhab to Shafi (Standard for Indonesia/Kemenag)
    // You might want to make this configurable too, but Shafi is safe default
    params.madhab = Madhab.Shafi;

    const prayerTimes = new PrayerTimes(coordinates, date, params);

    return {
      subuh: prayerTimes.fajr,
      dzuhur: prayerTimes.dhuhr,
      ashar: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isya: prayerTimes.isha,
    };
  } catch (error) {
    console.error('Error calculating prayer times:', error);
    return null;
  }
};
