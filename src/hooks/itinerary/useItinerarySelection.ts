import { Trip } from "@/types/database";
import { getTripDays } from "@/utils/dateUtils";
import { useMemo, useState } from "react";

export const useItinerarySelection = (trips: Trip[] | undefined) => {
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!selectedTripId && trips && trips.length > 0) {
    setSelectedTripId(trips[0].id);
  }

  const effectiveTripId =
    selectedTripId || (trips && trips.length > 0 ? trips[0].id : "");

  const activeTrip = trips?.find((t) => t.id === effectiveTripId);

  const tripDays = useMemo(() => {
    if (!activeTrip) return [];
    return getTripDays(activeTrip.start_date, activeTrip.end_date);
  }, [activeTrip]);

  if (!selectedDate && tripDays.length > 0) {
    setSelectedDate(tripDays[0].dateString);
  }

  const effectiveDate =
    selectedDate || (tripDays.length > 0 ? tripDays[0].dateString : null);

  const handleSelectTrip = (id: string) => {
    if (id !== selectedTripId) {
      setSelectedDate(null);
      setSelectedTripId(id);
    }
  };

  return {
    selectedTripId: effectiveTripId,
    selectedDate: effectiveDate,
    activeTrip,
    tripDays,
    setSelectedDate,
    handleSelectTrip,
  };
};
