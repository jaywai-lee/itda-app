import { Trip } from "@/types/database";
import { getTripDays } from "@/utils/dateUtils";
import { useEffect, useMemo, useState } from "react";

export const useItinerarySelection = (trips: Trip[] | undefined) => {
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const activeTrip = trips?.find((t) => t.id === selectedTripId);

  const tripDays = useMemo(() => {
    if (!activeTrip) return [];
    return getTripDays(activeTrip.start_date, activeTrip.end_date);
  }, [activeTrip]);

  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips, selectedTripId]);

  useEffect(() => {
    if (tripDays.length > 0 && !selectedDate) {
      setSelectedDate(tripDays[0].dateString);
    }
  }, [tripDays, selectedDate]);

  const handleSelectTrip = (id: string) => {
    if (id !== selectedTripId) {
      setSelectedDate(null);
      setSelectedTripId(id);
    }
  };

  return {
    selectedTripId,
    selectedDate,
    activeTrip,
    tripDays,
    setSelectedDate,
    handleSelectTrip,
  };
};
