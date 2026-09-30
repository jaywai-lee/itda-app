import { useCategories } from "@/hooks/category/useCategories";
import { useCreateExpense } from "@/hooks/expense/useCreateExpense";
import { useDeleteExpense } from "@/hooks/expense/useDeleteExpense";
import { useUpdateExpense } from "@/hooks/expense/useUpdateExpense";
import { Expense } from "@/types/database";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { CreateExpenseModalView } from "./CreateExpenseModalView";

interface CreateExpenseModalProps {
  tripId: string;
  currency: string;
  visible: boolean;
  onClose: () => void;
  editTarget?: Expense | null;
}

export const CreateExpenseModal = ({
  tripId,
  currency,
  visible,
  onClose,
  editTarget,
}: CreateExpenseModalProps) => {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

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
      } else {
        setAmount("");
        setCategoryId(categories.length > 0 ? categories[0].id : null);
        setMemo("");
        setPhotoUrl("");
      }
    }
  }, [visible, editTarget, categories]);

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

  const handleSubmit = () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert("알림", "올바른 지출 금액을 입력해 주세요.");
      return;
    }
    if (!categoryId) {
      Alert.alert("알림", "카테고리를 선택해 주세요.");
      return;
    }

    const expenseData = {
      trip_id: tripId,
      amount: Number(amount),
      currency,
      category_id: categoryId,
      memo,
      photo_url: photoUrl,
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
      createExpense(
        { ...expenseData, spent_at: new Date().toISOString() },
        {
          onSuccess: () => {
            Alert.alert("성공", "지출 내역이 등록되었습니다.");
            onClose();
          },
          onError: (e) => Alert.alert("오류", e.message),
        },
      );
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
      formState={{ amount, categoryId, memo, photoUrl }}
      handlers={{
        onChangeAmount: setAmount,
        onSelectCategory: setCategoryId,
        onChangeMemo: setMemo,
        onPickImage: handlePickImage,
        onRemoveImage: handleRemoveImage,
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
