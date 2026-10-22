import { CategorySettingsView } from "@/components/category/CategorySettingsView";
import {
  CATEGORY_COLORS,
  CATEGORY_ICON_KEYS,
} from "@/constants/categoryPresets";
import { useCategories } from "@/hooks/category/useCategories";
import {
  countExpensesByCategory,
  useCategoryCrud,
} from "@/hooks/category/useCategoryCrud";
import { Category } from "@/types/database";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

const DEFAULT_FORM = {
  name: "",
  color: CATEGORY_COLORS[0],
  iconName: CATEGORY_ICON_KEYS[0],
};

export default function CategorySettingsScreen() {
  const router = useRouter();
  const { data: categories = [], isLoading } = useCategories();
  const { createCategory, updateCategory, deleteCategory, isPending } =
    useCategoryCrud();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [name, setName] = useState(DEFAULT_FORM.name);
  const [color, setColor] = useState(DEFAULT_FORM.color);
  const [iconName, setIconName] = useState(DEFAULT_FORM.iconName);

  const handleGoBack = () => router.back();

  const handleOpenModal = (category?: Category) => {
    if (category) {
      if (category.user_id === null) return;
      setEditTarget(category);
      setName(category.name);
      setColor(category.color || DEFAULT_FORM.color);
      setIconName(category.icon || DEFAULT_FORM.iconName);
    } else {
      setEditTarget(null);
      setName(DEFAULT_FORM.name);
      setColor(DEFAULT_FORM.color);
      setIconName(DEFAULT_FORM.iconName);
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("알림", "카테고리 이름을 입력해주세요.");
      return;
    }

    const isDuplicate = categories.some(
      (c) =>
        c.id !== editTarget?.id &&
        c.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );

    if (isDuplicate) {
      Alert.alert("알림", "이미 같은 이름의 카테고리가 있어요.");
      return;
    }

    const payload = { name: trimmed, color, icon: iconName };

    if (editTarget) {
      updateCategory(
        { id: editTarget.id, ...payload },
        {
          onSuccess: handleCloseModal,
          onError: (e) => Alert.alert("오류", e.message),
        },
      );
    } else {
      createCategory(payload, {
        onSuccess: handleCloseModal,
        onError: (e) => Alert.alert("오류", e.message),
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const usageCount = await countExpensesByCategory(id);

      const message =
        usageCount > 0
          ? `이 카테고리로 등록된 지출이 ${usageCount}건 있어요.\n삭제하면 해당 지출은 카테고리가 비게 되고, 목록에는 '기타'로 표시돼요.\n정말 삭제할까요?`
          : "이 카테고리를 삭제할까요?";

      Alert.alert("삭제 확인", message, [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () =>
            deleteCategory(id, {
              onError: (e) => Alert.alert("오류", e.message),
            }),
        },
      ]);
    } catch {
      Alert.alert("오류", "데이터를 확인하는 중 문제가 발생했습니다.");
    }
  };

  return (
    <CategorySettingsView
      state={{
        categories,
        isLoading,
        isModalVisible,
        editTarget,
        form: { name, color, iconName },
        isPending,
      }}
      handlers={{
        onGoBack: handleGoBack,
        onOpenModal: handleOpenModal,
        onCloseModal: handleCloseModal,
        onSubmit: handleSubmit,
        onDelete: handleDelete,
        onChangeName: setName,
        onChangeColor: setColor,
        onChangeIconName: setIconName,
      }}
    />
  );
}
