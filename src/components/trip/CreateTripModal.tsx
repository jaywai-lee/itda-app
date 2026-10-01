import { COUNTRIES } from "@/constants/countries";
import { useCreateTrip } from "@/hooks/trip/useCreateTrip";
import { useUpdateTrip } from "@/hooks/trip/useUpdateTrip";
import { Trip } from "@/types/database";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { CreateTripModalView } from "./CreateTripModalView";

interface CreateTripModalProps {
  visible: boolean;
  onClose: () => void;
  editTarget?: Trip | null;
}

export const CreateTripModal = ({
  visible,
  onClose,
  editTarget,
}: CreateTripModalProps) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [country, setCountry] = useState<string>(COUNTRIES[0].label);
  const [currency, setCurrency] = useState<string>(COUNTRIES[0].currency);
  const [totalBudget, setTotalBudget] = useState("");

  const [pickerType, setPickerType] = useState<"start" | "end" | null>(null);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);

  const { mutate: createTrip, isPending: isCreating } = useCreateTrip();
  const { mutate: updateTrip, isPending: isUpdating } = useUpdateTrip();

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

  const handleSelectDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setPickerType(null);
    }
    if (selectedDate) {
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

  const handleSubmit = () => {
    if (!name || !startDate || !endDate) {
      Alert.alert("알림", "여행 이름과 기간을 입력해 주세요.");
      return;
    }

    const tripData = {
      name,
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      currency,
      total_budget: Number(totalBudget) || 0,
    };

    if (editTarget) {
      updateTrip(
        { id: editTarget.id, ...tripData },
        {
          onSuccess: () => {
            Alert.alert("성공", "여행 정보가 수정되었습니다.");
            onClose();
          },
          onError: (e) =>
            Alert.alert("오류", e.message || "여행 수정에 실패했습니다."),
        },
      );
    } else {
      createTrip(tripData, {
        onSuccess: () => {
          Alert.alert("성공", "새로운 여행이 등록되었습니다.");
          onClose();
        },
        onError: (e) =>
          Alert.alert("오류", e.message || "여행 등록에 실패했습니다."),
      });
    }
  };

  return (
    <CreateTripModalView
      visible={visible}
      onClose={onClose}
      formState={{
        name,
        startDate,
        endDate,
        currency,
        totalBudget,
        pickerType,
        country,
        isCountryPickerOpen,
      }}
      handlers={{
        onChangeName: setName,
        onChangeTotalBudget: setTotalBudget,
        onOpenPicker: setPickerType,
        onSelectDate: handleSelectDate,
        onDismissPicker: () => setPickerType(null),
        onSelectCountry: handleSelectCountry,
        onToggleCountryPicker: () => setIsCountryPickerOpen((prev) => !prev),
        onSubmit: handleSubmit,
      }}
      isPending={isCreating || isUpdating}
      isEditMode={!!editTarget}
    />
  );
};
