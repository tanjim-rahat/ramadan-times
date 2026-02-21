import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DistrictSelector } from "./components/DistrictSelector";
import { DivisionSelector } from "./components/DivisionSelector";
import { PrayerTimeCard } from "./components/PrayerTimeCard";
import { formatDate } from "./lib/utils";
import type { Division, District } from "./types/prayer";
import { fetchPrayerTimes } from "./lib/helpers";



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
          <PrayerTimeCard
            title="Sehri Ends"
            mainTime={data.timings.Imsak}
            subLabel="Fajr"
            subTime={data.timings.Fajr}
            borderColor="blue"
          />

          <PrayerTimeCard
            title="Iftar Begins"
            mainTime={data.timings.Maghrib}
            subLabel="Sunset"
            subTime={data.timings.Maghrib}
            borderColor="orange"
          />
          
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