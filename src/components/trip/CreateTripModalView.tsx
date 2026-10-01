import { COLORS } from "@/constants/colors";
import { COUNTRIES } from "@/constants/countries";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react-native";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { Modal } from "../common/Modal";

export interface CreateTripFormState {
  name: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  totalBudget: string;
  pickerType: "start" | "end" | null;
  country: string;
  isCountryPickerOpen: boolean;
}

export interface CreateTripFormHandlers {
  onChangeName: (text: string) => void;
  onChangeTotalBudget: (text: string) => void;
  onOpenPicker: (type: "start" | "end" | null) => void;
  onSelectDate: (event: any, date?: Date) => void;
  onDismissPicker: () => void;
  onSelectCountry: (label: string, currency: string) => void;
  onToggleCountryPicker: () => void;
  onSubmit: () => void;
}

interface CreateTripModalViewProps {
  visible: boolean;
  onClose: () => void;
  formState: CreateTripFormState;
  handlers: CreateTripFormHandlers;
  isPending: boolean;
  isEditMode: boolean;
}

export const CreateTripModalView = ({
  visible,
  onClose,
  formState,
  handlers,
  isPending,
  isEditMode,
}: CreateTripModalViewProps) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title={isEditMode ? "여행 정보 수정" : "새 여행 추가"} />

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

        <View className="mb-4 z-50">
          <Text className="text-sm font-semibold text-slate-text mb-1">
            여행 국가
          </Text>
          <Pressable
            onPress={handlers.onToggleCountryPicker}
            className="border border-slate-border rounded-xl p-3 bg-white flex-row justify-between items-center active:bg-slate-bg"
          >
            <Text className="text-slate-text">{formState.country}</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-bold text-slate-inactive">
                {formState.currency}
              </Text>
              <ChevronDown size={18} color={COLORS.slate.inactive} />
            </View>
          </Pressable>

          {formState.isCountryPickerOpen && (
            <View className="absolute top-16 left-0 right-0 bg-white border border-slate-border rounded-xl shadow-lg z-50 overflow-hidden">
              {COUNTRIES.map((item, index) => (
                <Pressable
                  key={item.currency}
                  onPress={() =>
                    handlers.onSelectCountry(item.label, item.currency)
                  }
                  className={`p-3 flex-row justify-between items-center active:bg-slate-bg ${
                    index !== COUNTRIES.length - 1
                      ? "border-b border-slate-border"
                      : ""
                  }`}
                >
                  <Text className="text-slate-text">{item.label}</Text>
                  <Text className="text-xs text-slate-inactive">
                    {item.currency}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-text mb-1">
              시작일
            </Text>
            <Pressable
              onPress={() => handlers.onOpenPicker("start")}
              className="border border-slate-border rounded-xl p-3 bg-white"
            >
              <Text className="text-slate-text">
                {format(formState.startDate, "yyyy-MM-dd")}
              </Text>
            </Pressable>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-text mb-1">
              종료일
            </Text>
            <Pressable
              onPress={() => handlers.onOpenPicker("end")}
              className="border border-slate-border rounded-xl p-3 bg-white"
            >
              <Text className="text-slate-text">
                {format(formState.endDate, "yyyy-MM-dd")}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-semibold text-slate-text mb-1">
            총 예산 ({formState.currency})
          </Text>
          <TextInput
            placeholder="0"
            keyboardType="numeric"
            value={formState.totalBudget}
            onChangeText={handlers.onChangeTotalBudget}
            className="border border-slate-border rounded-xl p-3 text-slate-text"
          />
        </View>

        {formState.pickerType && (
          <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-slate-border rounded-t-3xl shadow-2xl z-50">
            <View className="flex-row justify-between items-center mb-2 px-2">
              <Text className="text-base font-bold text-slate-text">
                {formState.pickerType === "start"
                  ? "🛫 시작일 선택"
                  : "🛬 종료일 선택"}
              </Text>
              <Pressable
                onPress={handlers.onDismissPicker}
                className="bg-slate-bg px-4 py-2 rounded-xl active:opacity-80"
              >
                <Text className="text-slate-text font-bold text-sm">확인</Text>
              </Pressable>
            </View>

            <DateTimePicker
              value={
                formState.pickerType === "start"
                  ? formState.startDate
                  : formState.endDate
              }
              minimumDate={
                formState.pickerType === "end" ? formState.startDate : undefined
              }
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={handlers.onSelectDate}
            />
          </View>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Pressable
          onPress={handlers.onSubmit}
          disabled={isPending}
          className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-bold text-base">
            {isPending
              ? "저장 중..."
              : isEditMode
                ? "수정 완료"
                : "여행 등록하기"}
          </Text>
        </Pressable>
      </Modal.Footer>
    </Modal>
  );
};
