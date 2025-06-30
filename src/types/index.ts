export interface PrayerTime {
  name: string;
  time: Date;
  key: string;
}

export interface PrayerTimes {
  [key: string]: PrayerTime;
}

export interface DzikirContent {
  arabic: string;
  latin: string;
  translation_id: string;
  ayat_number?: number;
  title_extra?: string;
}

export interface DzikirVerse extends DzikirContent {
  ayat_number: number;
}

export interface DzikirItem {
  id: string;
  title: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  translation?: string;
  total_taps: number;
  content?: DzikirContent[];
  verses?: DzikirVerse[];
}

export interface PrayerData {
  [month: string]: Array<{
    tanggal: string;
    imsak: string;
    subuh: string;
    terbit: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
  }>;
}

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
}