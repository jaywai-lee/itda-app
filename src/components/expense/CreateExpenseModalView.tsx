import { Pressable, Text, TextInput } from "react-native";
import { Modal } from "../common/Modal";

export interface CreateExpenseFormState {
  amount: string;
  category: string;
  memo: string;
}

export interface CreateExpenseFormHandlers {
  onChangeAmount: (text: string) => void;
  onChangeCategory: (text: string) => void;
  onChangeMemo: (text: string) => void;
  onSubmit: () => void;
}

interface CreateExpenseModalViewProps {
  visible: boolean;
  onClose: () => void;
  currency: string;
  formState: CreateExpenseFormState;
  handlers: CreateExpenseFormHandlers;
  isPending: boolean;
}

export const CreateExpenseModalView = ({
  visible,
  onClose,
  currency,
  formState,
  handlers,
  isPending,
}: CreateExpenseModalViewProps) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title="지출 추가" />

      <Modal.Body>
        <Text className="text-sm font-semibold text-slate-text mb-1">
          금액 ({currency})
        </Text>
        <TextInput
          placeholder="0"
          keyboardType="numeric"
          value={formState.amount}
          onChangeText={handlers.onChangeAmount}
          className="border border-slate-border rounded-xl p-3 mb-4 text-slate-text"
        />

        <Text className="text-sm font-semibold text-slate-text mb-1">
          카테고리
        </Text>
        <TextInput
          placeholder="식비, 쇼핑, 교통 등"
          value={formState.category}
          onChangeText={handlers.onChangeCategory}
          className="border border-slate-border rounded-xl p-3 mb-4 text-slate-text"
        />

        <Text className="text-sm font-semibold text-slate-text mb-1">
          메모 (선택)
        </Text>
        <TextInput
          placeholder="예: 저녁 바비큐 식사"
          value={formState.memo}
          onChangeText={handlers.onChangeMemo}
          className="border border-slate-border rounded-xl p-3 text-slate-text"
        />
      </Modal.Body>

      <Pressable
        onPress={handlers.onSubmit}
        disabled={isPending}
        className="bg-primary p-4 rounded-xl items-center active:opacity-80"
      >
        <Text className="text-white font-bold text-base">
          {isPending ? "저장 중..." : "지출 등록하기"}
        </Text>
      </Pressable>
    </Modal>
  );
};
