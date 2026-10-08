import { useCategories } from "@/hooks/category/useCategories";
import { useCreateExpense } from "@/hooks/expense/useCreateExpense";
import { useDeleteExpense } from "@/hooks/expense/useDeleteExpense";
import { useUpdateExpense } from "@/hooks/expense/useUpdateExpense";
import { Expense } from "@/types/database";
import { fetchExchangeRate } from "@/utils/currency";
import { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import { parseISO } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { CreateExpenseModalView } from "./CreateExpenseModalView";

interface CreateExpenseModalProps {
  tripId: string;
  currency: string;
  totalBudget: number;
  currentTotalSpent: number;
  visible: boolean;
  onClose: () => void;
  editTarget?: Expense | null;
  itineraryId?: string | null;
  itineraryVisitDate?: string | null;
}

export const CreateExpenseModal = ({
  tripId,
  currency,
  totalBudget,
  currentTotalSpent,
  visible,
  onClose,
  editTarget,
  itineraryId,
  itineraryVisitDate,
}: CreateExpenseModalProps) => {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [linkedItineraryId, setLinkedItineraryId] = useState<string | null>(
    null,
  );
  const [spentDate, setSpentDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories(tripId);
  const { mutate: createExpense, isPending: isCreating } = useCreateExpense();
  const { mutate: updateExpense, isPending: isUpdating } = useUpdateExpense();
  const { mutate: deleteExpense } = useDeleteExpense();

  useEffect(() => {
    if (visible) {
      if (editTarget) {
        setAmount(editTarget.amount.toString());
        setCategoryId(editTarget.category_id || null);
        setMemo(editTarget.memo || "");
        setPhotoUrl(editTarget.photo_url || "");
        setLinkedItineraryId(editTarget.itinerary_id ?? null);
        setSpentDate(parseISO(editTarget.spent_at));
      } else {
        setAmount("");
        setCategoryId(categories.length > 0 ? categories[0].id : null);
        setMemo("");
        setPhotoUrl("");
        setLinkedItineraryId(itineraryId ?? null);
        setSpentDate(
          itineraryVisitDate ? parseISO(itineraryVisitDate) : new Date(),
        );
      }
      setIsDatePickerOpen(false);
    }
  }, [visible, editTarget, categories, itineraryId, itineraryVisitDate]);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "권한 필요",
        "사진을 첨부하려면 갤러리 접근 권한이 필요합니다.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setPhotoUrl("");
  };

  const handleChangeSpentDate = (
    event: DateTimePickerChangeEvent,
    date: Date,
  ) => {
    setSpentDate(date);
    if (Platform.OS === "android") setIsDatePickerOpen(false);
  };

  const handleSubmit = async () => {
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

  return (
    <CreateExpenseModalView
      visible={visible}
      onClose={onClose}
      currency={currency}
      formState={{
        amount,
        categoryId,
        memo,
        photoUrl,
        spentDate,
        isDatePickerOpen,
      }}
      handlers={{
        onChangeAmount: setAmount,
        onSelectCategory: setCategoryId,
        onChangeMemo: setMemo,
        onPickImage: handlePickImage,
        onRemoveImage: handleRemoveImage,
        onToggleDatePicker: setIsDatePickerOpen,
        onChangeSpentDate: handleChangeSpentDate,
        onSubmit: handleSubmit,
        onDelete: handleDelete,
      }}
      isPending={isCreating || isUpdating}
      isEditMode={!!editTarget}
      categories={categories}
      isLoadingCategories={isLoadingCategories}
    />
  );
};
