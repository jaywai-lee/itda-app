import { useCreateTripModal } from "@/hooks/trip/useCreateTripModal";
import { Trip } from "@/types/database";
import { CreateTripModalView } from "./CreateTripModalView";

interface CreateTripModalProps {
  visible: boolean;
  onClose: () => void;
  editTarget?: Trip | null;
}

export const CreateTripModal = (props: CreateTripModalProps) => {
  const { formState, handlers, meta } = useCreateTripModal(props);

  return (
    <CreateTripModalView
      visible={props.visible}
      onClose={props.onClose}
      formState={formState}
      handlers={handlers}
      isPending={meta.isPending}
      isEditMode={meta.isEditMode}
    />
  );
};
