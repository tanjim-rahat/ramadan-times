import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertTo12Hour } from "@/lib/utils";
import { Clock, Sunrise, Sunset } from "lucide-react";

interface PrayerTimeCardProps {
  title: string;
  mainTime: string;
  subLabel: string;
  subTime: string;
  borderColor: "blue" | "orange";
}

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  isActive: boolean;
}

export function PrayerTimeCard({ 
  title, 
  mainTime, 
  subLabel, 
  subTime, 
  borderColor 
}: PrayerTimeCardProps) {
  const borderClass = borderColor === "blue" ? "border-t-blue-500" : "border-t-orange-500";
  const bgGradient = borderColor === "blue" 
    ? "from-blue-500/5 to-transparent" 
    : "from-orange-500/5 to-transparent";
  const glowColor = borderColor === "blue" ? "shadow-blue-500/20" : "shadow-orange-500/20";
  const Icon = borderColor === "blue" ? Sunrise : Sunset;
  const [countdown, setCountdown] = useState<CountdownTime>({ hours: 0, minutes: 0, seconds: 0, isActive: false });

  useEffect(() => {
    const calculateCountdown = () => {
      // Parse the prayer time (format: HH:mm)
      const [hours, minutes] = mainTime.split(':').map(Number);
      
      // Create a date object for the prayer time today
      const now = new Date();
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      // If prayer time has passed today, consider it for tomorrow
      if (prayerTime < now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      // Calculate 2 hours before prayer time
      const twoHoursBefore = new Date(prayerTime.getTime() - 2 * 60 * 60 * 1000);

      // Calculate time difference
      const timeDiff = prayerTime.getTime() - now.getTime();
      const timeUntilCountdown = twoHoursBefore.getTime() - now.getTime();

      // Show countdown if we're within 2 hours of prayer time
      if (timeUntilCountdown <= 0 && timeDiff > 0) {
        const totalSeconds = Math.floor(timeDiff / 1000);
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        setCountdown({
          hours: hrs,
          minutes: mins,
          seconds: secs,
          isActive: true
        });
      } else {
        setCountdown({ hours: 0, minutes: 0, seconds: 0, isActive: false });
      }
    };

    // Calculate immediately
    calculateCountdown();

    // Update every second
    const interval = setInterval(calculateCountdown, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [mainTime]);

  const formatCountdown = (time: CountdownTime) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative w-full"
    >
      <Card className={`border-t-4 ${borderClass} bg-linear-to-b ${bgGradient} backdrop-blur-sm overflow-hidden ${countdown.isActive ? `shadow-lg ${glowColor}` : ''} transition-shadow duration-300 h-full`}>
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: countdown.isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        
        <CardHeader className="relative pb-3 sm:pb-6">
          <motion.div 
            className="flex items-center justify-center gap-1.5 sm:gap-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <CardTitle className="text-center text-lg sm:text-xl">{title}</CardTitle>
          </motion.div>
        </CardHeader>
        
        <CardContent className="relative pt-0">
          <motion.p 
            className="text-4xl sm:text-5xl font-black text-center bg-linear-to-br from-foreground to-foreground/70 bg-clip-text leading-tight"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {convertTo12Hour(mainTime)}
          </motion.p>
          
          <AnimatePresence mode="wait">
            {countdown.isActive && (
              <motion.div 
                className="mt-4 sm:mt-6 text-center relative"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <p className="text-xs sm:text-sm font-medium text-primary">Time Remaining</p>
                </div>
                
                <div className="inline-block px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary tabular-nums"
                  >
                    {formatCountdown(countdown)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.p 
            className="text-center text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {subLabel}: {convertTo12Hour(subTime)}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
