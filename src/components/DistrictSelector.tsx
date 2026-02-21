import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type District, type Division } from "../types/prayer";
import { fetchDistricts } from "../lib/helpers";

export function DistrictSelector({ 
  setDistrict, 
  division 
}: { 
  setDistrict: (val: District) => void;
  division?: Division | null;
}) {
  const query = useQuery({
    queryKey: ["districts", division?.id],
    queryFn: () => fetchDistricts(division!),
    enabled: division != null, // Only fetch when a division is selected
  });

  const errorMessage = query.error instanceof Error ? query.error.message : "Error loading districts";
  const isDisabled = query.isLoading || !!query.error || division == null;

  const onSelect = (districtName: string) => {
    const selectedDistrict = query.data?.find((d) => d.name === districtName);
    if (selectedDistrict) {
      setDistrict(selectedDistrict);
    }
   };

  return (
    <div className="w-full md:w-[300px]">
      <Select onValueChange={onSelect} disabled={isDisabled}>
        <SelectTrigger 
          className="w-full bg-card"
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
          className="max-h-[300px] overflow-y-auto"
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
    </div>
  );
}