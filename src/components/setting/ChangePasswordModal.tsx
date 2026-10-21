import { COLORS } from "@/constants/colors";
import { Pressable, TextInput } from "react-native";
import { Modal } from "../common/Modal";
import { Typography } from "../common/Typography";

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
        <Typography className="text-sm font-semibold text-ink mb-2">
          새 비밀번호
        </Typography>
        <TextInput
          value={state.newPassword}
          onChangeText={handlers.setNewPassword}
          placeholder="6자리 이상 입력"
          placeholderTextColor={COLORS.ink.mute}
          secureTextEntry
          className="border border-line bg-surface rounded-xl p-3 text-ink mb-4 font-semibold"
        />

        <Typography className="text-sm font-semibold text-ink mb-2">
          새 비밀번호 확인
        </Typography>
        <TextInput
          value={state.confirmPassword}
          onChangeText={handlers.setConfirmPassword}
          placeholder="비밀번호 재입력"
          placeholderTextColor={COLORS.ink.mute}
          secureTextEntry
          className="border border-line bg-surface rounded-xl p-3 text-ink mb-2 font-semibold"
        />
      </Modal.Body>
      <Modal.Footer>
        <Pressable
          onPress={handlers.handleSubmit}
          disabled={state.isPending}
          className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80 transition-all"
        >
          <Typography className="text-white font-bold text-base">
            {state.isPending ? "변경 중..." : "변경하기"}
          </Typography>
        </Pressable>
      </Modal.Footer>
    </Modal>
  );
};
