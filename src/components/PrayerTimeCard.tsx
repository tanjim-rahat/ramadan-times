import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertTo12Hour } from "@/lib/utils";

interface PrayerTimeCardProps {
  title: string;
  mainTime: string;
  subLabel: string;
  subTime: string;
  borderColor: "blue" | "orange";
}

export function PrayerTimeCard({ 
  title, 
  mainTime, 
  subLabel, 
  subTime, 
  borderColor 
}: PrayerTimeCardProps) {
  const borderClass = borderColor === "blue" ? "border-t-blue-500" : "border-t-orange-500";

  return (
    <Card className={`border-t-4 ${borderClass}`}>
      <CardHeader>
        <CardTitle className="text-center text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-5xl font-black text-center">{convertTo12Hour(mainTime)}</p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {subLabel}: {convertTo12Hour(subTime)}
        </p>
      </CardContent>
    </Card>
  );
}
