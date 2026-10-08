import { useAddPlaceModal } from "@/hooks/itinerary/useAddPlaceModal";
import { Itinerary } from "@/types/database";
import { AddPlaceModalView } from "./AddPlaceModalView";

interface AddPlaceModalProps {
  visible: boolean;
  onClose: () => void;
  tripId: string;
  selectedDate: string | null;
  editTarget?: Itinerary | null;
}

export const AddPlaceModal = (props: AddPlaceModalProps) => {
  const { formState, handlers, meta } = useAddPlaceModal(props);

  return (
    <AddPlaceModalView
      visible={props.visible}
      onClose={props.onClose}
      formState={formState}
      handlers={handlers}
      isPending={meta.isPending}
      isEditMode={meta.isEditMode}
    />
  );
};
