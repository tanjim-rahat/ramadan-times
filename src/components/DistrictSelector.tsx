import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type District, type Division } from "../types/prayer";
import { fetchDistricts } from "../lib/helpers";

const DISTRICT_STORAGE_KEY = "selectedDistrictName";

export function DistrictSelector({
  district, 
  setDistrict, 
  division 
}: { 
  district?: District | null;
  setDistrict: (val: District) => void;
  division?: Division | null;
}) {
  const query = useQuery({
    queryKey: ["districts", division?.id],
    queryFn: () => fetchDistricts(division!),
    enabled: division != null, // Only fetch when a division is selected
  });

  // Load saved district from localStorage when districts are fetched
  useEffect(() => {
    if (query.data && query.data.length > 0 && !district) {
      const savedDistrictName = localStorage.getItem(DISTRICT_STORAGE_KEY);
      if (savedDistrictName) {
        const savedDistrict = query.data.find((d) => d.name === savedDistrictName);
        if (savedDistrict) {
          setDistrict(savedDistrict);
        }
      }
    }
  }, [query.data, district, setDistrict]);

  const errorMessage = query.error instanceof Error ? query.error.message : "Error loading districts";
  const isDisabled = query.isLoading || !!query.error || division == null;

  const onSelect = (districtName: string) => {
    const selectedDistrict = query.data?.find((d) => d.name === districtName);
    if (selectedDistrict) {
      localStorage.setItem(DISTRICT_STORAGE_KEY, districtName);
      setDistrict(selectedDistrict);
    }
   };

  return (
    <motion.div 
      className="w-full sm:w-75"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Select value={district?.name} onValueChange={onSelect} disabled={isDisabled}>
        <SelectTrigger 
          className="w-full h-11 sm:h-10 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-200 text-sm sm:text-base"
          aria-label="Select district for prayer times"
          aria-describedby={query.error ? "district-error" : undefined}
        >
          <SelectValue placeholder={
            query.isLoading ? "Loading districts..." : 
            query.error ? "Error loading districts" :
            !division ? "Select a division first" :
            "Select your District"
          } />
        </SelectTrigger>
        <SelectContent 
          className="max-h-75 overflow-y-auto"
          position="popper"
        >
          {query.data?.length === 0 && query.isSuccess ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No districts available
            </div>
          ) : (
            query.data && query.data.map((d) => (
              <SelectItem key={d.id} value={d.name}>
                {d.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {query.error && (
        <p id="district-error" className="mt-1 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {query.isLoading ? "Loading districts..." : `${query.data?.length || 0} districts available`}
      </span>
    </motion.div>
  );
}