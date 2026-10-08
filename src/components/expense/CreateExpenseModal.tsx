import { useCreateExpenseModal } from "@/hooks/expense/useCreateExpenseModal";
import { Expense } from "@/types/database";
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

export const CreateExpenseModal = (props: CreateExpenseModalProps) => {
  const { formState, handlers, meta } = useCreateExpenseModal(props);

  return (
    <CreateExpenseModalView
      visible={props.visible}
      onClose={props.onClose}
      currency={props.currency}
      formState={formState}
      handlers={handlers}
      isPending={meta.isPending}
      isEditMode={meta.isEditMode}
      categories={meta.categories}
      isLoadingCategories={meta.isLoadingCategories}
    />
  );
};
