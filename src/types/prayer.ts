export interface District {
  district: string;
  districtbn: string;
}

export interface PrayerTimings {
  Fajr: string;
  Maghrib: string;
  Imsak: string;
  Sunrise: string;
}

export interface AlAdhanData {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: { day: string; month: { en: string }; year: string };
  };
}