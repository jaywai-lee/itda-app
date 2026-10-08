import { Trip } from "@/types/database";
import { format } from "date-fns";
import { Alert } from "react-native";
import { useCreateTrip } from "./useCreateTrip";
import { useUpdateTrip } from "./useUpdateTrip";

interface SubmitOptions {
  editTarget?: Trip | null;
  onClose: () => void;
}

interface TripFormData {
  name: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  totalBudget: string;
}

export const useTripSubmit = ({ editTarget, onClose }: SubmitOptions) => {
  const { mutate: createTrip, isPending: isCreating } = useCreateTrip();
  const { mutate: updateTrip, isPending: isUpdating } = useUpdateTrip();

  const handleSubmit = (formData: TripFormData) => {
    const { name, startDate, endDate, currency, totalBudget } = formData;

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
          onError: (e: Error) =>
            Alert.alert("오류", e.message || "여행 수정에 실패했습니다."),
        },
      );
    } else {
      createTrip(tripData, {
        onSuccess: () => {
          Alert.alert("성공", "새로운 여행이 등록되었습니다.");
          onClose();
        },
        onError: (e: Error) =>
          Alert.alert("오류", e.message || "여행 등록에 실패했습니다."),
      });
    }
  };

  return {
    handleSubmit,
    isPending: isCreating || isUpdating,
  };
};
