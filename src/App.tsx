import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { DistrictSelector } from "./components/DistrictSelector";
import { DivisionSelector } from "./components/DivisionSelector";
import { PrayerTimeCard } from "./components/PrayerTimeCard";
import { formatDate } from "./lib/utils";
import type { Division, District } from "./types/prayer";
import { fetchPrayerTimes } from "./lib/helpers";
import { Moon, MapPin, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 text-foreground px-3 py-4 sm:p-6 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 relative overflow-hidden safe-area-padding">
      {/* Animated background pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, currentColor 2%, transparent 0%), radial-gradient(circle at 75px 75px, currentColor 1%, transparent 0%)`,
          backgroundSize: '100px 100px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '100px 100px']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.header 
        className="text-center relative z-10 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Moon className="w-7 h-7 sm:w-10 sm:h-10 text-primary" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
            Ramadan 2026
          </h1>
        </motion.div>
        <motion.p 
          className="text-muted-foreground text-base sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Sehri & Iftar Tracker
        </motion.p>
      </motion.header>

      <motion.div 
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <DivisionSelector setDivision={handleDivisionChange} />
        <DistrictSelector setDistrict={setDistrict} division={division} />
      </motion.div>

      <AnimatePresence mode="wait">
        {(district && division) && (
          <motion.div 
            className="text-center relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                {division && <span className="font-semibold text-foreground">{division.name}</span>}
                {division && district && <span className="mx-1 sm:mx-1.5 text-muted-foreground/50">•</span>}
                {district && <span className="font-semibold text-foreground">{district.name}</span>}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            className="text-center py-12 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Loader2 className="h-10 w-10 text-primary" />
            </motion.div>
            <motion.p 
              className="mt-4 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Loading prayer times...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            className="w-full max-w-2xl relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-destructive bg-destructive/5 backdrop-blur-sm">
              <CardContent className="pt-6">
                <motion.p 
                  className="text-center text-destructive"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="font-semibold">Error:</span> {errorMessage}
                </motion.p>
                <motion.p 
                  className="text-center text-sm text-muted-foreground mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Please try selecting a different district.
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && data && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PrayerTimeCard
                title="Sehri Ends"
                mainTime={data.timings.Imsak}
                subLabel="Fajr"
                subTime={data.timings.Fajr}
                borderColor="blue"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <PrayerTimeCard
                title="Iftar Begins"
                mainTime={data.timings.Maghrib}
                subLabel="Sunset"
                subTime={data.timings.Maghrib}
                borderColor="orange"
              />
            </motion.div>
            
            <motion.div 
              className="col-span-full text-center p-4 sm:p-6 bg-linear-to-r from-secondary/50 via-secondary to-secondary/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
               <motion.p 
                 className="font-bold text-base sm:text-lg bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.6 }}
               >
                 {data.date.hijri.day} {data.date.hijri.month.en} {data.date.hijri.year} AH
               </motion.p>
               <motion.p 
                 className="text-xs sm:text-sm text-muted-foreground mt-1"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.7 }}
               >
                 {formatDate(data.date.readable)}
               </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isLoading && !data && !error && (
          <motion.div 
            className="text-center py-12 relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="inline-block p-6 sm:p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border/50 max-w-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground/50" />
              <p className="text-sm sm:text-base text-muted-foreground">
                {!division 
                  ? "Please select a division and district to view prayer times"
                  : !district
                  ? "Please select a district to view prayer times"
                  : "Select a district to view prayer times"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}