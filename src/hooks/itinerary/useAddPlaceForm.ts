import { Itinerary } from "@/types/database";
import { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export const useAddPlaceForm = (
  visible: boolean,
  selectedDate: string | null,
  editTarget: Itinerary | null,
) => {
  const [placeName, setPlaceName] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editTarget) {
        setPlaceName(editTarget.place_name || "");
        setLat(editTarget.lat ?? null);
        setLng(editTarget.lng ?? null);
        setVisitDate(
          editTarget.visit_date ? parseISO(editTarget.visit_date) : new Date(),
        );
        setMemo(editTarget.memo || "");
      } else {
        setPlaceName("");
        setLat(null);
        setLng(null);
        setVisitDate(selectedDate ? parseISO(selectedDate) : new Date());
        setMemo("");
      }
      setIsDatePickerOpen(false);
    }
  }, [visible, editTarget, selectedDate]);

  const handlePlaceSelect = (
    name: string,
    selectedLat: number,
    selectedLng: number,
  ) => {
    setPlaceName(name);
    setLat(selectedLat);
    setLng(selectedLng);
  };

  const handleChangeDate = (event: DateTimePickerChangeEvent, date: Date) => {
    if (date) setVisitDate(date);
    if (Platform.OS === "android") setIsDatePickerOpen(false);
  };

  const handleDismissDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  return {
    state: { placeName, lat, lng, visitDate, memo, isDatePickerOpen },
    setters: { setMemo, setIsDatePickerOpen },
    handlers: { handlePlaceSelect, handleChangeDate, handleDismissDatePicker },
  };
};
