import { Trip } from "@/types/database";
import { useTripForm } from "./useTripForm";
import { useTripSubmit } from "./useTripSubmit";

interface UseCreateTripModalProps {
  visible: boolean;
  onClose: () => void;
  editTarget?: Trip | null;
}

export const useCreateTripModal = ({
  visible,
  onClose,
  editTarget,
}: UseCreateTripModalProps) => {
  const form = useTripForm(visible, editTarget);
  const submit = useTripSubmit({ editTarget, onClose });

  const handleFinalSubmit = () => {
    submit.handleSubmit({
      name: form.state.name,
      startDate: form.state.startDate,
      endDate: form.state.endDate,
      currency: form.state.currency,
      totalBudget: form.state.totalBudget,
    });
  };

  return {
    formState: form.state,
    handlers: {
      onChangeName: form.setters.setName,
      onChangeTotalBudget: form.setters.setTotalBudget,
      onOpenPicker: form.setters.setPickerType,
      onSelectDate: form.handlers.handleSelectDate,
      onDismissPicker: () => form.setters.setPickerType(null),
      onSelectCountry: form.handlers.handleSelectCountry,
      onToggleCountryPicker: () =>
        form.setters.setIsCountryPickerOpen((prev) => !prev),
      onSubmit: handleFinalSubmit,
    },
    meta: {
      isPending: submit.isPending,
      isEditMode: !!editTarget,
    },
  };
};
