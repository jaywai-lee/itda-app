import { Itinerary } from "@/types/database";
import { format } from "date-fns";
import { Alert } from "react-native";
import { useCreateItinerary } from "./useCreateItinerary";
import { useUpdateItinerary } from "./useUpdateItinerary";

interface SubmitOptions {
  tripId: string;
  editTarget?: Itinerary | null;
  onClose: () => void;
}

export const useAddPlaceSubmit = ({
  tripId,
  editTarget,
  onClose,
}: SubmitOptions) => {
  const { mutate: createItinerary, isPending: isCreating } =
    useCreateItinerary();
  const { mutate: updateItinerary, isPending: isUpdating } =
    useUpdateItinerary();

  const handleSubmit = (formData: {
    placeName: string;
    lat: number | null;
    lng: number | null;
    visitDate: Date;
    memo: string;
  }) => {
    const { placeName, lat, lng, visitDate, memo } = formData;

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
            Alert.alert("성공", "일정이 수정되었습니다.");
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
            Alert.alert("성공", "장소가 일정에 추가되었습니다.");
            onClose();
          },
          onError: (e) => Alert.alert("오류", e.message),
        },
      );
    }
  };

  return {
    handleSubmit,
    isPending: isCreating || isUpdating,
  };
};
