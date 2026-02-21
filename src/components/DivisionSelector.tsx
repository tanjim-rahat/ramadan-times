import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchDivisions } from "../lib/helpers";
import type { Division } from "@/types/prayer";

export function DivisionSelector({ setDivision }: { setDivision: (val: Division) => void }) {
  const { data: divisions = [], isLoading, error } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivisions,
  });

  const errorMessage = error instanceof Error ? error.message : "Error loading divisions";

  const onSelect = (divisionId: string) => {
    const selectedDivision = divisions.find((d) => d.id === divisionId);
    if (selectedDivision) {
      setDivision(selectedDivision);
    }
  };

  return (
    <div className="w-full md:w-[300px]">
      <Select onValueChange={onSelect} disabled={isLoading || !!error}>
        <SelectTrigger 
          className="w-full bg-card"
          aria-label="Select division for prayer times"
          aria-describedby={error ? "division-error" : undefined}
        >
          <SelectValue placeholder={
            isLoading ? "Loading divisions..." : 
            error ? "Error loading divisions" : 
            "Select your Division"
          } />
        </SelectTrigger>
        <SelectContent 
          className="max-h-[300px] overflow-y-auto"
          position="popper"
        >
          {divisions.length === 0 && !isLoading ? (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No divisions available
            </div>
          ) : (
            divisions.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && (
        <p id="division-error" className="mt-1 text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {isLoading ? "Loading divisions..." : `${divisions.length} divisions available`}
      </span>
    </div>
  );
}
