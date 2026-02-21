export interface Division {
  id: string;
  name: string;
}

export interface District {
  id: number | string;
  name: string;
  division_id?: string;
  division_name?: string;
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