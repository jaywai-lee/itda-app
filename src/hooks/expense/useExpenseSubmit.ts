import { Expense } from "@/types/database";
import { fetchExchangeRate } from "@/utils/currency";
import { useState } from "react";
import { Alert } from "react-native";
import { useCreateExpense } from "./useCreateExpense";
import { useDeleteExpense } from "./useDeleteExpense";
import { useUpdateExpense } from "./useUpdateExpense";

interface SubmitOptions {
  tripId: string;
  currency: string;
  totalBudget: number;
  currentTotalSpent: number;
  editTarget?: Expense | null;
  onClose: () => void;
}

export const useExpenseSubmit = ({
  tripId,
  currency,
  totalBudget,
  currentTotalSpent,
  editTarget,
  onClose,
}: SubmitOptions) => {
  const [isCalculating, setIsCalculating] = useState(false);

  const { mutate: createExpense, isPending: isCreating } = useCreateExpense();
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense();
  const { mutate: deleteExpense } = useDeleteExpense();

  const handleSubmit = async (expenseData: {
    amount: string;
    categoryId: string | null;
    memo: string;
    photoUrl: string;
    spentDate: Date;
    linkedItineraryId: string | null;
  }) => {
    const { amount, categoryId, memo, photoUrl, spentDate, linkedItineraryId } =
      expenseData;

    if (!amount || !categoryId) {
      Alert.alert("알림", "금액과 카테고리를 입력해 주세요.");
      return;
    }

    const numericAmount = Number(amount);

    const effectiveCurrentSpent = editTarget
      ? currentTotalSpent - editTarget.amount
      : currentTotalSpent;
    const nextTotalSpent = effectiveCurrentSpent + numericAmount;

    if (nextTotalSpent > totalBudget) {
      const isConfirmed = await new Promise<boolean>((resolve) => {
        Alert.alert(
          "⚠️ 예산 초과 경고",
          `이 지출을 등록하면 총 예산(${totalBudget.toLocaleString()} ${currency})을 초과하게 됩니다.\n그래도 등록하시겠습니까?`,
          [
            { text: "취소", onPress: () => resolve(false), style: "cancel" },
            {
              text: "등록",
              onPress: () => resolve(true),
              style: "destructive",
            },
          ],
        );
      });

      if (!isConfirmed) return;
    }

    try {
      setIsCalculating(true);

      const rate = await fetchExchangeRate(currency);
      const amountKrw = Math.round(Number(amount) * rate);
      const normalizedSpentAt = new Date(spentDate);
      normalizedSpentAt.setHours(12, 0, 0, 0);

      const expenseData = {
        trip_id: tripId,
        amount: Number(amount),
        currency,
        amount_krw: amountKrw,
        category_id: categoryId,
        memo,
        photo_url: photoUrl,
        itinerary_id: linkedItineraryId,
        spent_at: normalizedSpentAt.toISOString(),
      };

      if (editTarget) {
        updateExpense(
          { id: editTarget.id, ...expenseData },
          {
            onSuccess: () => {
              Alert.alert("성공", "지출 내역이 수정되었습니다.");
              onClose();
            },
            onError: (e) => Alert.alert("오류", e.message),
          },
        );
      } else {
        createExpense(expenseData, {
          onSuccess: () => {
            Alert.alert("성공", "지출 내역이 등록되었습니다.");
            onClose();
          },
          onError: (e) => Alert.alert("오류", e.message),
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "결제 처리에 실패했습니다.";
      Alert.alert("환율 오류", errorMessage);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDelete = () => {
    if (!editTarget) return;
    Alert.alert("지출 삭제", "이 지출 내역을 정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          deleteExpense(editTarget.id, {
            onSuccess: () => {
              Alert.alert("성공", "삭제되었습니다.");
              onClose();
            },
            onError: (e) => Alert.alert("오류", e.message),
          });
        },
      },
    ]);
  };

  return {
    handleSubmit,
    handleDelete,
    isPending: isCreating || isUpdating || isCalculating,
  };
};
