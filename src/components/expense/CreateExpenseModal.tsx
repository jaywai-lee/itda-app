import { useCreateExpense } from "@/hooks/expense/useCreateExpense";
import { useState } from "react";
import { Alert } from "react-native";
import { CreateExpenseModalView } from "./CreateExpenseModalView";

interface CreateExpenseModalProps {
  tripId: string;
  currency: string;
  visible: boolean;
  onClose: () => void;
}

export const CreateExpenseModal = ({
  tripId,
  currency,
  visible,
  onClose,
}: CreateExpenseModalProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("식비");
  const [memo, setMemo] = useState("");

  const { mutate: createExpense, isPending } = useCreateExpense();

  const handleResetForm = () => {
    setAmount("");
    setCategory("식비");
    setMemo("");
  };

  const handleSubmit = () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert("알림", "올바른 지출 금액을 입력해 주세요.");
      return;
    }

    createExpense(
      {
        trip_id: tripId,
        amount: Number(amount),
        currency,
        category_id: category,
        memo,
        spent_at: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          Alert.alert("성공", "지출 내역이 등록되었습니다.");
          handleResetForm();
          onClose();
        },
        onError: (error) => {
          Alert.alert("오류", error.message || "지출 등록에 실패했습니다.");
        },
      },
    );
  };

  return (
    <CreateExpenseModalView
      visible={visible}
      onClose={onClose}
      currency={currency}
      formState={{ amount, category, memo }}
      handlers={{
        onChangeAmount: setAmount,
        onChangeCategory: setCategory,
        onChangeMemo: setMemo,
        onSubmit: handleSubmit,
      }}
      isPending={isPending}
    />
  );
};
