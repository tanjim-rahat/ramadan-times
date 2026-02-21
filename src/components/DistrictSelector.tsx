import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type District } from "../types/prayer";

export function DistrictSelector({ onSelect }: { onSelect: (val: string) => void }) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://bdapis.vercel.app/geo/v2.0/districts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load districts");
        return res.json();
      })
      .then((json) => {
        setDistricts(json.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full md:w-[300px]">
      <Select onValueChange={onSelect} disabled={isLoading || !!error}>
        <SelectTrigger 
          className="w-full bg-card"
          aria-label="Select district for prayer times"
          aria-describedby={error ? "district-error" : undefined}
        >
          <SelectValue placeholder={
            isLoading ? "Loading districts..." : 
            error ? "Error loading districts" : 
            "Select your District"
          } />
        </SelectTrigger>
        <SelectContent 
          className="max-h-[300px] overflow-y-auto"
          position="popper"
        >
          {districts.length === 0 && !isLoading ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No districts available
            </div>
          ) : (
            districts.map((d) => (
              <SelectItem key={d.id} value={d.name}>
                {d.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && (
        <p id="district-error" className="mt-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading ? "Loading districts..." : `${districts.length} districts available`}
      </span>
    </div>
  );
}