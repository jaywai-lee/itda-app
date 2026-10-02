import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { AddPlaceModalView } from "./AddPlaceModalView";

interface AddPlaceModalProps {
  visible: boolean;
  onClose: () => void;
  tripId: string;
}

export const AddPlaceModal = ({
  visible,
  onClose,
  tripId,
}: AddPlaceModalProps) => {
  const [placeName, setPlaceName] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleResetForm = () => {
    setPlaceName("");
    setLat(null);
    setLng(null);
    setVisitDate(new Date());
    setMemo("");
    setIsDatePickerOpen(false);
  };

  const handlePlaceSelect = (
    name: string,
    selectedLat: number,
    selectedLng: number,
  ) => {
    setPlaceName(name);
    setLat(selectedLat);
    setLng(selectedLng);
  };

  const handleChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setIsDatePickerOpen(false);
    if (date) setVisitDate(date);
  };

  const handleSubmit = () => {
    if (!placeName || lat === null || lng === null) {
      Alert.alert("알림", "지도에서 장소를 검색하고 선택해 주세요.");
      return;
    }

    const newItineraryData = {
      trip_id: tripId,
      place_name: placeName,
      lat,
      lng,
      visit_date: format(visitDate, "yyyy-MM-dd"),
      memo,
    };

    console.log("저장될 일정 데이터:", newItineraryData);
    Alert.alert("임시 성공", "장소 데이터가 폼에서 성공적으로 추출되었습니다.");
    handleResetForm();
    onClose();
  };

  return (
    <AddPlaceModalView
      visible={visible}
      onClose={onClose}
      formState={{ placeName, lat, lng, visitDate, memo, isDatePickerOpen }}
      handlers={{
        onPlaceSelect: handlePlaceSelect,
        onChangeMemo: setMemo,
        onToggleDatePicker: setIsDatePickerOpen,
        onChangeDate: handleChangeDate,
        onSubmit: handleSubmit,
      }}
      isPending={false}
    />
  );
};
