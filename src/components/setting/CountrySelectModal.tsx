import { COUNTRIES } from "@/constants/countries";
import { Pressable, ScrollView, Text } from "react-native";
import { Modal } from "../common/Modal";

interface CountrySelectModalProps {
  visible: boolean;
  onClose: () => void;
  currentCountry: string;
  onSelect: (country: string, currency: string) => void;
}

export const CountrySelectModal = ({
  visible,
  onClose,
  currentCountry,
  onSelect,
}: CountrySelectModalProps) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title="기본 국가/통화 설정" />
      <Modal.Body>
        <ScrollView
          className="max-h-[60vh]"
          showsVerticalScrollIndicator={false}
        >
          {COUNTRIES.map((item, index) => {
            const isSelected = currentCountry === item.label;
            return (
              <Pressable
                key={item.currency}
                onPress={() => {
                  onSelect(item.label, item.currency);
                  onClose();
                }}
                className={`p-4 flex-row justify-between items-center active:bg-slate-50 ${
                  index !== COUNTRIES.length - 1
                    ? "border-b border-slate-border"
                    : ""
                }`}
              >
                <Text
                  className={`text-base ${
                    isSelected ? "font-bold text-primary" : "text-slate-text"
                  }`}
                >
                  {item.label}
                </Text>
                <Text
                  className={`text-sm ${
                    isSelected
                      ? "font-bold text-primary"
                      : "text-slate-inactive"
                  }`}
                >
                  {item.currency}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Modal.Body>
    </Modal>
  );
};
