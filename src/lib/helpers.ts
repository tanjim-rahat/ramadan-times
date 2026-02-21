import { type Division } from "../types/prayer";

export const fetchDivisions = async (): Promise<Division[]> => {
  const response = await fetch("https://bdapis.vercel.app/geo/v2.0/divisions");
  if (!response.ok) {
    throw new Error("Failed to load divisions");
  }
  const json = await response.json();
  return json.data;
};