import { useCreateItinerary } from "@/hooks/itinerary/useCreateItinerary";
import { useUpdateItinerary } from "@/hooks/itinerary/useUpdateItinerary";
import { Itinerary } from "@/types/database";
import { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { AddPlaceModalView } from "./AddPlaceModalView";

interface AddPlaceModalProps {
  visible: boolean;
  onClose: () => void;
  tripId: string;
  editTarget?: Itinerary | null;
}

export const AddPlaceModal = ({
  visible,
  onClose,
  tripId,
  editTarget,
}: AddPlaceModalProps) => {
  const [placeName, setPlaceName] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState(new Date());
  const [memo, setMemo] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { mutate: createItinerary, isPending: isCreating } =
    useCreateItinerary();
  const { mutate: updateItinerary, isPending: isUpdating } =
    useUpdateItinerary();

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
        setVisitDate(new Date());
        setMemo("");
      }
      setIsDatePickerOpen(false);
    }
  }, [visible, editTarget]);

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
    setVisitDate(date);

    if (Platform.OS === "android") setIsDatePickerOpen(false);
  };

  const handleSubmit = () => {
    if (!placeName || lat === null || lng === null) {
      Alert.alert("알림", "지도에서 장소를 검색하고 선택해 주세요.");
      return;
    }

    const itineraryData = {
      trip_id: tripId,
      title: placeName,
      place_name: placeName,
      lat,
      lng,
      visit_date: format(visitDate, "yyyy-MM-dd"),
      memo,
    };

    if (editTarget) {
      updateItinerary(
        { id: editTarget.id, ...itineraryData },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (e) => Alert.alert("오류", e.message),
        },
      );
    } else {
      createItinerary(
        { ...itineraryData, order_index: 0 },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (e) => Alert.alert("오류", e.message),
        },
      );
    }
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
      isPending={isCreating || isUpdating}
      isEditMode={!!editTarget}
    />
  );
};
