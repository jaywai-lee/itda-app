import { Pressable, Text, TextInput } from "react-native";
import { Modal } from "../common/Modal";

interface ChangePasswordModalProps {
  state: {
    isVisible: boolean;
    newPassword: string;
    confirmPassword: string;
    isPending: boolean;
  };
  handlers: {
    closeModal: () => void;
    setNewPassword: (text: string) => void;
    setConfirmPassword: (text: string) => void;
    handleSubmit: () => void;
  };
}

export const ChangePasswordModal = ({
  state,
  handlers,
}: ChangePasswordModalProps) => {
  return (
    <Modal visible={state.isVisible} onClose={handlers.closeModal}>
      <Modal.Header title="비밀번호 변경" />
      <Modal.Body>
        <Text className="text-sm font-semibold text-slate-text mb-2">
          새 비밀번호
        </Text>
        <TextInput
          value={state.newPassword}
          onChangeText={handlers.setNewPassword}
          placeholder="6자리 이상 입력"
          secureTextEntry
          className="border border-slate-border rounded-xl p-3 text-slate-text mb-4 font-semibold"
        />

        <Text className="text-sm font-semibold text-slate-text mb-2">
          새 비밀번호 확인
        </Text>
        <TextInput
          value={state.confirmPassword}
          onChangeText={handlers.setConfirmPassword}
          placeholder="비밀번호 재입력"
          secureTextEntry
          className="border border-slate-border rounded-xl p-3 text-slate-text mb-2 font-semibold"
        />
      </Modal.Body>
      <Modal.Footer>
        <Pressable
          onPress={handlers.handleSubmit}
          disabled={state.isPending}
          className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-bold text-base">
            {state.isPending ? "변경 중..." : "변경하기"}
          </Text>
        </Pressable>
      </Modal.Footer>
    </Modal>
  );
};
