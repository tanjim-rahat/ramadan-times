import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/select";
import { DistrictSelector } from "./components/DistrictSelector";
import { AlAdhanData } from "./types/prayer";

export default function App() {
  const [location, setLocation] = useState("Dhaka");
  const [data, setData] = useState<AlAdhanData | null>(null);

  useEffect(() => {
    // AlAdhan API call using the selected district
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${location}&country=Bangladesh&method=1`)
      .then((res) => res.json())
      .then((json) => setData(json.data));
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Ramadan 2026</h1>
        <p className="text-muted-foreground">Sehri & Iftar Tracker</p>
      </header>

      <DistrictSelector onSelect={setLocation} />

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Sehri Card */}
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <CardTitle className="text-center text-xl">Sehri Ends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-black text-center">{data.timings.Fajr}</p>
              <p className="text-center text-sm text-muted-foreground mt-2">Imsak: {data.timings.Imsak}</p>
            </CardContent>
          </Card>

          {/* Iftar Card */}
          <Card className="border-t-4 border-t-orange-500">
            <CardHeader>
              <CardTitle className="text-center text-xl">Iftar Begins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-black text-center">{data.timings.Maghrib}</p>
              <p className="text-center text-sm text-muted-foreground mt-2">Sunset: {data.timings.Maghrib}</p>
            </CardContent>
          </Card>
          
          <div className="col-span-full text-center p-4 bg-secondary rounded-lg">
             <p className="font-medium">{data.date.hijri.day} {data.date.hijri.month.en} {data.date.hijri.year} AH</p>
             <p className="text-xs text-muted-foreground">{data.date.readable}</p>
          </div>
        </div>
      )}
    </div>
  );
}