import { COLORS } from "@/constants/colors";
import { Check } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { Modal } from "../common/Modal";

interface BudgetThresholdModalProps {
  visible: boolean;
  onClose: () => void;
  currentThreshold: number;
  onSelect: (threshold: number) => void;
  isUpdating: boolean;
}

const THRESHOLD_OPTIONS = [
  { label: "사용 안 함", value: 0 },
  { label: "50% 사용 시", value: 50 },
  { label: "80% 사용 시", value: 80 },
  { label: "90% 사용 시", value: 90 },
  { label: "100% 초과 시", value: 100 },
];

export const BudgetThresholdModal = ({
  visible,
  onClose,
  currentThreshold,
  onSelect,
  isUpdating,
}: BudgetThresholdModalProps) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title="예산 경고 기준 설정" />
      <Modal.Body>
        <View className="bg-slate-bg rounded-2xl overflow-hidden">
          {THRESHOLD_OPTIONS.map((option, index) => {
            const isSelected = currentThreshold === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onSelect(option.value)}
                disabled={isUpdating}
                className={`flex-row items-center justify-between p-4 bg-white active:opacity-70 ${
                  index !== THRESHOLD_OPTIONS.length - 1
                    ? "border-b border-slate-border"
                    : ""
                }`}
              >
                <Text
                  className={`text-base font-medium ${
                    isSelected ? "text-primary font-bold" : "text-slate-text"
                  }`}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Check size={20} color={COLORS.primary.DEFAULT} />
                )}
              </Pressable>
            );
          })}
        </View>
      </Modal.Body>
    </Modal>
  );
};
