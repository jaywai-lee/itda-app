import { Itinerary } from "@/types/database";
import { useAddPlaceForm } from "./useAddPlaceForm";
import { useAddPlaceSubmit } from "./useAddPlaceSubmit";

interface UseAddPlaceModalProps {
  visible: boolean;
  onClose: () => void;
  tripId: string;
  selectedDate: string | null;
  editTarget?: Itinerary | null;
}

export const useAddPlaceModal = ({
  visible,
  onClose,
  tripId,
  selectedDate,
  editTarget,
}: UseAddPlaceModalProps) => {
  const form = useAddPlaceForm(visible, selectedDate, editTarget ?? null);
  const submit = useAddPlaceSubmit({ tripId, editTarget, onClose });

  const handleFinalSubmit = () => {
    submit.handleSubmit({
      placeName: form.state.placeName,
      lat: form.state.lat,
      lng: form.state.lng,
      visitDate: form.state.visitDate,
      memo: form.state.memo,
    });
  };

  return {
    formState: form.state,
    handlers: {
      onPlaceSelect: form.handlers.handlePlaceSelect,
      onChangeMemo: form.setters.setMemo,
      onToggleDatePicker: form.setters.setIsDatePickerOpen,
      onChangeDate: form.handlers.handleChangeDate,
      onDismissDatePicker: form.handlers.handleDismissDatePicker,
      onSubmit: handleFinalSubmit,
    },
    meta: {
      isPending: submit.isPending,
      isEditMode: !!editTarget,
    },
  };
};
