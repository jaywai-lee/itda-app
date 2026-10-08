import { COUNTRIES } from "@/constants/countries";
import { Trip } from "@/types/database";
import { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

export const useTripForm = (visible: boolean, editTarget?: Trip | null) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [country, setCountry] = useState<string>(COUNTRIES[0].label);
  const [currency, setCurrency] = useState<string>(COUNTRIES[0].currency);
  const [totalBudget, setTotalBudget] = useState("");
  const [pickerType, setPickerType] = useState<"start" | "end" | null>(null);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editTarget) {
        setName(editTarget.name);
        setStartDate(
          editTarget.start_date ? parseISO(editTarget.start_date) : new Date(),
        );
        setEndDate(
          editTarget.end_date ? parseISO(editTarget.end_date) : new Date(),
        );
        setCurrency(editTarget.currency);
        const matchedCountry = COUNTRIES.find(
          (c) => c.currency === editTarget.currency,
        );
        setCountry(matchedCountry ? matchedCountry.label : "직접 입력");
        setTotalBudget(editTarget.total_budget.toString());
      } else {
        setName("");
        setStartDate(new Date());
        setEndDate(new Date());
        setCountry(COUNTRIES[0].label);
        setCurrency(COUNTRIES[0].currency);
        setTotalBudget("");
      }
      setPickerType(null);
      setIsCountryPickerOpen(false);
    }
  }, [visible, editTarget]);

  const handleSelectDate = (
    event: DateTimePickerChangeEvent,
    selectedDate: Date,
  ) => {
    if (Platform.OS === "android") {
      setPickerType(null);
    }

    if (pickerType === "start") {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    } else if (pickerType === "end") {
      if (selectedDate < startDate) {
        Alert.alert("알림", "종료일은 시작일보다 이전일 수 없습니다.");
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const handleSelectCountry = (
    selectedLabel: string,
    selectedCurrency: string,
  ) => {
    setCountry(selectedLabel);
    setCurrency(selectedCurrency);
    setIsCountryPickerOpen(false);
  };

  return {
    state: {
      name,
      startDate,
      endDate,
      country,
      currency,
      totalBudget,
      pickerType,
      isCountryPickerOpen,
    },
    setters: { setName, setTotalBudget, setPickerType, setIsCountryPickerOpen },
    handlers: { handleSelectDate, handleSelectCountry },
  };
};
