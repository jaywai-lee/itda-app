import { COUNTRIES } from "@/constants/countries";
import { Pressable, ScrollView, View } from "react-native";
import { Modal } from "../common/Modal";
import { Typography } from "../common/Typography";

interface CountrySelectModalProps {
  visible: boolean;
  onClose: () => void;
  currentCountry: string;
  onSelect: (country: string, currency: string) => void;
  isUpdating?: boolean;
}

export const CountrySelectModal = ({
  visible,
  onClose,
  currentCountry,
  onSelect,
  isUpdating,
}: CountrySelectModalProps) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title="기본 국가/통화 설정" />
      <Modal.Body>
        <ScrollView
          className="max-h-[60vh]"
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-surface rounded-2xl overflow-hidden border border-line">
            {COUNTRIES.map((item, index) => {
              const isSelected = currentCountry === item.label;
              return (
                <Pressable
                  key={item.currency}
                  disabled={isUpdating}
                  onPress={() => {
                    onSelect(item.label, item.currency);
                  }}
                  className={`p-4 flex-row justify-between items-center bg-surface active:bg-fill transition-all ${
                    index !== COUNTRIES.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  <Typography
                    className={`text-base ${
                      isSelected ? "font-bold text-primary" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    className={`text-sm ${
                      isSelected ? "font-bold text-primary" : "text-ink-mute"
                    }`}
                  >
                    {item.currency}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </Modal.Body>
    </Modal>
  );
};
