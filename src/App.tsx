import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DistrictSelector } from "./components/DistrictSelector";
import { DivisionSelector } from "./components/DivisionSelector";
import { convertTo12Hour, formatDate } from "./lib/utils";
import type { AlAdhanData, Division, District } from "./types/prayer";

const fetchPrayerTimes = async (district: District): Promise<AlAdhanData> => {
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

export default function App() {
  const [district, setDistrict] = useState<District | null>(null);
  const [division, setDivision] = useState<Division | null>(null);

  const handleDivisionChange = (newDivision: Division) => {
    setDivision(newDivision);
    setDistrict(null); // Reset district when division changes
  };

  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["prayerTimes", district?.id],
    queryFn: () => fetchPrayerTimes(district!),
    enabled: district != null,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  const errorMessage = error instanceof Error ? error.message : "Error loading prayer times";

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Ramadan 2026</h1>
        <p className="text-muted-foreground">Sehri & Iftar Tracker</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
        <DivisionSelector setDivision={handleDivisionChange} />
        <DistrictSelector setDistrict={setDistrict} division={division} />
      </div>

      {(district && division) && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing prayer times for{" "}
            {division && <span className="font-semibold text-foreground">{division.name}</span>}
            {division && district && <span className="mx-1">—</span>}
            {district && <span className="font-semibold text-foreground">{district.name}</span>}
          </p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading prayer times...</p>
        </div>
      )}

      {error && (
        <Card className="w-full max-w-2xl border-destructive">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">
              <span className="font-semibold">Error:</span> {errorMessage}
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Please try selecting a different district.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Sehri Card */}
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="text-center text-xl">Sehri Ends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-black text-center">{convertTo12Hour(data.timings.Fajr)}</p>
              <p className="text-center text-sm text-muted-foreground mt-2">Sunrise: {convertTo12Hour(data.timings.Imsak)}</p>
            </CardContent>
          </Card>

          {/* Iftar Card */}
          <Card className="border-t-4 border-t-orange-500">
            <CardHeader>
              <CardTitle className="text-center text-xl">Iftar Begins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-black text-center">{convertTo12Hour(data.timings.Maghrib)}</p>
              <p className="text-center text-sm text-muted-foreground mt-2">Sunset: {convertTo12Hour(data.timings.Maghrib)}</p>
            </CardContent>
          </Card>
          
          <div className="col-span-full text-center p-4 bg-secondary rounded-lg">
             <p className="font-medium">{data.date.hijri.day} {data.date.hijri.month.en} {data.date.hijri.year} AH</p>
             <p className="text-xs text-muted-foreground">{formatDate(data.date.readable)}</p>
          </div>
        </div>
      )}

      {!isLoading && !data && !error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {!division 
              ? "Please select a division and district to view prayer times"
              : !district
              ? "Please select a district to view prayer times"
              : "Select a district to view prayer times"}
          </p>
        </div>
      )}
    </div>
  );
}