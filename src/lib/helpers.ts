import type { Division, District, AlAdhanData } from "../types/prayer";

export const fetchDivisions = async (): Promise<Division[]> => {
  const response = await fetch("https://bdapis.vercel.app/geo/v2.0/divisions");
  if (!response.ok) {
    throw new Error("Failed to load divisions");
  }
  const json = await response.json();
  return json.data;
};

export const fetchDistricts = async (division: Division): Promise<District[]> => {
  const response = await fetch("https://bdapis.vercel.app/geo/v2.0/districts/" + division.id);
  if (!response.ok) {
    throw new Error("Failed to load districts");
  }
  const json = await response.json();
  return json.data;
};

export const fetchPrayerTimes = async (district: District): Promise<AlAdhanData> => {
  const response = await fetch(
    `https://api.aladhan.com/v1/timingsByCity?city=${district.name}&country=Bangladesh&method=1`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch prayer times");
  }
  const json = await response.json();
  if (json.code !== 200) {
    throw new Error(json.data || "Invalid location");
  }
  return json.data;
};