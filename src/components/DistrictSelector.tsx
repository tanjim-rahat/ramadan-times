import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type District } from "../types/prayer";

export function DistrictSelector({ onSelect }: { onSelect: (val: string) => void }) {
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    fetch("https://bdapis.vercel.app/api/v1.2/districts")
      .then((res) => res.json())
      .then((json) => setDistricts(json.data));
  }, []);

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-full md:w-[300px] bg-card">
        <SelectValue placeholder="Select your District" />
      </SelectTrigger>
      <SelectContent>
        {districts.map((d) => (
          <SelectItem key={d.district} value={d.district}>
            {d.district} ({d.districtbn})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}