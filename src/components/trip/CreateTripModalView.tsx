import { Pressable, Text, TextInput, View } from "react-native";
import { Modal } from "../common/Modal";

export interface CreateTripFormState {
  name: string;
  startDate: string;
  endDate: string;
  currency: string;
  totalBudget: string;
}

export interface CreateTripFormHandlers {
  onChangeName: (text: string) => void;
  onChangeStartDate: (text: string) => void;
  onChangeEndDate: (text: string) => void;
  onChangeCurrency: (text: string) => void;
  onChangeTotalBudget: (text: string) => void;
  onSubmit: () => void;
}

interface CreateTripModalViewProps {
  visible: boolean;
  onClose: () => void;
  formState: CreateTripFormState;
  handlers: CreateTripFormHandlers;
  isPending: boolean;
}

export const CreateTripModalView = ({
  visible,
  onClose,
  formState,
  handlers,
  isPending,
}: CreateTripModalViewProps) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title="새 여행 추가" />
      <Modal.Body>
        <Text className="text-sm font-semibold text-slate-text mb-1">
          여행 이름
        </Text>
        <TextInput
          placeholder="예: 도쿄 3박 4일 여행"
          value={formState.name}
          onChangeText={handlers.onChangeName}
          className="border border-slate-border rounded-xl p-3 mb-4 text-slate-text"
        />

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-text mb-1">
              시작일
            </Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={formState.startDate}
              onChangeText={handlers.onChangeStartDate}
              className="border border-slate-border rounded-xl p-3 text-slate-text"
            />
          </View>

          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-text mb-1">
              종료일
            </Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={formState.endDate}
              onChangeText={handlers.onChangeEndDate}
              className="border border-slate-border rounded-xl p-3 text-slate-text"
            />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="w-28">
            <Text className="text-sm font-semibold text-slate-text mb-1">
              통화
            </Text>
            <TextInput
              placeholder="KRW"
              value={formState.currency}
              onChangeText={handlers.onChangeCurrency}
              className="border border-slate-border rounded-xl p-3 text-slate-text uppercase"
            />
          </View>

          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-text mb-1">
              총 예산
            </Text>
            <TextInput
              placeholder="0"
              keyboardType="numeric"
              value={formState.totalBudget}
              onChangeText={handlers.onChangeTotalBudget}
              className="border border-slate-border rounded-xl p-3 text-slate-text"
            />
          </View>
        </View>
      </Modal.Body>

      <Modal.Footer>
        <Pressable
          onPress={handlers.onSubmit}
          disabled={isPending}
          className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-bold text-base">
            {isPending ? "저장 중..." : "여행 등록하기"}
          </Text>
        </Pressable>
      </Modal.Footer>
    </Modal>
  );
};
