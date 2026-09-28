import { useCreateTrip } from "@/hooks/useCreateTrip";
import { useState } from "react";
import { Alert } from "react-native";
import { CreateTripModalView } from "./CreateTripModalView";

interface CreateTripModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateTripModal = ({ visible, onClose }: CreateTripModalProps) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currency, setCurrency] = useState("KRW");
  const [totalBudget, setTotalBudget] = useState("");

  const { mutate: createTrip, isPending } = useCreateTrip();

  const handleResetForm = () => {
    setName("");
    setStartDate("");
    setEndDate("");
    setCurrency("KRW");
    setTotalBudget("");
  };

  const handleSubmit = () => {
    if (!name || !startDate || !endDate) {
      Alert.alert("알림", "여행 이름과 기간을 입력해 주세요.");
      return;
    }

    createTrip(
      {
        name,
        start_date: startDate,
        end_date: endDate,
        currency,
        total_budget: Number(totalBudget) || 0,
      },
      {
        onSuccess: () => {
          Alert.alert("성공", "새로운 여행이 등록되었습니다.");
          handleResetForm();
          onClose();
        },
        onError: (error) => {
          Alert.alert("오류", error.message || "여행 등록에 실패했습니다.");
        },
      },
    );
  };

  return (
    <CreateTripModalView
      visible={visible}
      onClose={onClose}
      formState={{ name, startDate, endDate, currency, totalBudget }}
      handlers={{
        onChangeName: setName,
        onChangeStartDate: setStartDate,
        onChangeEndDate: setEndDate,
        onChangeCurrency: setCurrency,
        onChangeTotalBudget: setTotalBudget,
        onSubmit: handleSubmit,
      }}
      isPending={isPending}
    />
  );
};
