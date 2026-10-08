import { Expense } from "@/types/database";
import { useCategories } from "../category/useCategories";
import { useExpenseForm } from "./useExpenseForm";
import { useExpenseImage } from "./useExpenseImage";
import { useExpenseSubmit } from "./useExpenseSubmit";

interface UseCreateExpenseModalProps {
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

export const useCreateExpenseModal = (props: UseCreateExpenseModalProps) => {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories(props.tripId);

  const form = useExpenseForm(
    props.visible,
    categories,
    props.editTarget,
    props.itineraryId,
    props.itineraryVisitDate,
  );

  const image = useExpenseImage(props.visible, props.editTarget);

  const submit = useExpenseSubmit({
    tripId: props.tripId,
    currency: props.currency,
    totalBudget: props.totalBudget,
    currentTotalSpent: props.currentTotalSpent,
    editTarget: props.editTarget,
    onClose: props.onClose,
  });

  const handleFinalSubmit = () => {
    submit.handleSubmit({
      amount: form.state.amount,
      categoryId: form.state.categoryId,
      memo: form.state.memo,
      photoUrl: image.photoUrl,
      spentDate: form.state.spentDate,
      linkedItineraryId: form.state.linkedItineraryId,
    });
  };

  return {
    formState: {
      ...form.state,
      photoUrl: image.photoUrl,
    },
    handlers: {
      onChangeAmount: form.setters.setAmount,
      onSelectCategory: form.setters.setCategoryId,
      onChangeMemo: form.setters.setMemo,
      onPickImage: image.handlePickImage,
      onRemoveImage: image.handleRemoveImage,
      onToggleDatePicker: form.setters.setIsDatePickerOpen,
      onChangeSpentDate: form.handlers.handleChangeSpentDate,
      onSubmit: handleFinalSubmit,
      onDelete: submit.handleDelete,
    },
    meta: {
      isPending: submit.isPending,
      isEditMode: !!props.editTarget,
      categories,
      isLoadingCategories,
    },
  };
};
