import { COUNTRIES } from "@/constants/countries";
import { Trip } from "@/types/database";
import { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { parseISO } from "date-fns";
import { useState } from "react";
import { Alert } from "react-native";
import { useUserSettings } from "../auth/useUserSettings";

export const useTripForm = (visible: boolean, editTarget?: Trip | null) => {
  const { settings } = useUserSettings();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [country, setCountry] = useState<string>(COUNTRIES[0].label);
  const [currency, setCurrency] = useState<string>(COUNTRIES[0].currency);
  const [totalBudget, setTotalBudget] = useState("");
  const [pickerType, setPickerType] = useState<"start" | "end" | null>(null);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [customExchangeRate, setCustomExchangeRate] = useState<string>("");

  const [prevProps, setPrevProps] = useState({
    visible: false,
    editTarget,
    settings,
  });

  if (
    visible !== prevProps.visible ||
    editTarget !== prevProps.editTarget ||
    settings !== prevProps.settings
  ) {
    setPrevProps({ visible, editTarget, settings });

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
        setCustomExchangeRate(
          editTarget.custom_exchange_rate
            ? editTarget.custom_exchange_rate.toString()
            : "",
        );
      } else {
        const defaultCountry = settings?.defaultCountry ?? COUNTRIES[0].label;
        const defaultCurrency =
          settings?.defaultCurrency ?? COUNTRIES[0].currency;

        setName("");
        setStartDate(new Date());
        setEndDate(new Date());
        setCountry(defaultCountry);
        setCurrency(defaultCurrency);
        setTotalBudget("");
        setCustomExchangeRate("");
      }
      setPickerType(null);
      setIsCountryPickerOpen(false);
    }
  }

  const handleSelectDate = (
    event: DateTimePickerChangeEvent,
    selectedDate: Date,
  ) => {
    const type = pickerType;
    setPickerType(null);

    if (type === "start") {
      setStartDate(selectedDate);
      if (selectedDate > endDate) setEndDate(selectedDate);
    } else if (type === "end") {
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
      customExchangeRate,
    },
    setters: {
      setName,
      setTotalBudget,
      setPickerType,
      setIsCountryPickerOpen,
      setCustomExchangeRate,
    },
    handlers: { handleSelectDate, handleSelectCountry },
  };
};
