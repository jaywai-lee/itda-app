import { COLORS } from "@/constants/colors";
import { COUNTRIES } from "@/constants/countries";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react-native";
import { Platform, Pressable, TextInput, View } from "react-native";
import { Modal } from "../common/Modal";
import { Typography } from "../common/Typography";

export interface CreateTripFormState {
  name: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  totalBudget: string;
  pickerType: "start" | "end" | null;
  country: string;
  isCountryPickerOpen: boolean;
  customExchangeRate: string;
}

export interface CreateTripFormHandlers {
  onChangeName: (text: string) => void;
  onChangeTotalBudget: (text: string) => void;
  onOpenPicker: (type: "start" | "end" | null) => void;
  onSelectDate: (event: DateTimePickerChangeEvent, date: Date) => void;
  onDismissPicker: () => void;
  onSelectCountry: (label: string, currency: string) => void;
  onToggleCountryPicker: () => void;
  onChangeCustomExchangeRate: (text: string) => void;
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
  const { pickerType } = formState;

  const picker = pickerType ? (
    <DateTimePicker
      key={pickerType}
      value={pickerType === "start" ? formState.startDate : formState.endDate}
      minimumDate={pickerType === "end" ? formState.startDate : undefined}
      mode="date"
      display={Platform.OS === "ios" ? "inline" : "default"}
      onValueChange={handlers.onSelectDate}
      onDismiss={handlers.onDismissPicker}
    />
  ) : null;

  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title={isEditMode ? "여행 정보 수정" : "새 여행 추가"} />

      <Modal.Body>
        <Typography className="text-sm font-semibold text-ink mb-1">
          여행 이름
        </Typography>
        <TextInput
          placeholder="예: 도쿄 3박 4일 여행"
          value={formState.name}
          onChangeText={handlers.onChangeName}
          placeholderTextColor={COLORS.ink.mute}
          className="border border-line bg-surface rounded-xl p-3 mb-4 text-ink"
        />

        <View className="mb-4 z-50">
          <Typography className="text-sm font-semibold text-ink mb-1">
            여행 국가
          </Typography>
          <Pressable
            onPress={handlers.onToggleCountryPicker}
            className="border border-line rounded-xl p-3 bg-surface flex-row justify-between items-center active:bg-fill-strong transition-all"
          >
            <Typography className="text-ink">{formState.country}</Typography>
            <View className="flex-row items-center gap-2">
              <Typography className="text-xs font-bold text-ink-mute">
                {formState.currency}
              </Typography>
              <ChevronDown size={18} color={COLORS.ink.mute} />
            </View>
          </Pressable>

          {formState.currency !== "KRW" && (
            <View className="mb-4 mt-4">
              <Typography className="text-sm font-semibold text-ink mb-1">
                적용 환율 (선택)
              </Typography>
              <View className="flex-row items-center">
                <Typography className="text-sm font-bold text-ink mr-3">
                  1 {formState.currency} =
                </Typography>
                <TextInput
                  placeholder="미입력 시 실시간 환율 적용"
                  value={formState.customExchangeRate}
                  onChangeText={handlers.onChangeCustomExchangeRate}
                  placeholderTextColor={COLORS.ink.mute}
                  keyboardType="numeric"
                  className="flex-1 border border-line rounded-xl p-3 text-ink bg-surface"
                />
                <Typography className="text-sm font-bold text-ink ml-3">
                  원 (KRW)
                </Typography>
              </View>
            </View>
          )}

          {formState.isCountryPickerOpen && (
            <View className="absolute top-16 left-0 right-0 bg-surface border border-line rounded-xl shadow-lg z-50 overflow-hidden">
              {COUNTRIES.map((item, index) => (
                <Pressable
                  key={item.currency}
                  onPress={() =>
                    handlers.onSelectCountry(item.label, item.currency)
                  }
                  className={`p-3 flex-row justify-between items-center active:bg-fill transition-all ${
                    index !== COUNTRIES.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  <Typography className="text-ink">{item.label}</Typography>
                  <Typography className="text-xs text-ink-mute">
                    {item.currency}
                  </Typography>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Typography className="text-sm font-semibold text-ink mb-1">
              시작일
            </Typography>
            <Pressable
              onPress={() => handlers.onOpenPicker("start")}
              className={`border rounded-xl p-3 bg-surface active:bg-fill-strong transition-all ${
                pickerType === "start" ? "border-primary" : "border-line"
              }`}
            >
              <Typography className="text-ink">
                {format(formState.startDate, "yyyy-MM-dd")}
              </Typography>
            </Pressable>
          </View>
          <View className="flex-1">
            <Typography className="text-sm font-semibold text-ink mb-1">
              종료일
            </Typography>
            <Pressable
              onPress={() => handlers.onOpenPicker("end")}
              className={`border rounded-xl p-3 bg-surface active:bg-fill-strong transition-all ${
                pickerType === "end" ? "border-primary" : "border-line"
              }`}
            >
              <Typography className="text-ink">
                {format(formState.endDate, "yyyy-MM-dd")}
              </Typography>
            </Pressable>
          </View>
        </View>

        <View className="mb-6">
          <Typography className="text-sm font-semibold text-ink mb-1">
            총 예산 ({formState.currency})
          </Typography>
          <TextInput
            placeholder="0"
            keyboardType="numeric"
            value={formState.totalBudget}
            onChangeText={handlers.onChangeTotalBudget}
            placeholderTextColor={COLORS.ink.mute}
            className="border border-line bg-surface rounded-xl p-3 text-ink"
          />
        </View>

        {pickerType && Platform.OS === "ios" && (
          <View className="absolute bottom-0 left-0 right-0 bg-surface p-5 border border-line rounded-3xl shadow-2xl z-50">
            <View className="flex-row justify-between items-center mb-2 px-2">
              <Typography className="text-base font-bold text-ink">
                {pickerType === "start" ? "🛫 시작일 선택" : "🛬 종료일 선택"}
              </Typography>
              <Pressable
                onPress={handlers.onDismissPicker}
                className="bg-fill px-4 py-2 rounded-xl active:bg-fill-strong"
              >
                <Typography className="text-ink font-bold text-sm">
                  닫기
                </Typography>
              </Pressable>
            </View>
            {picker}
          </View>
        )}

        {pickerType && Platform.OS === "android" && picker}
      </Modal.Body>

      <Modal.Footer>
        <Pressable
          onPress={handlers.onSubmit}
          disabled={isPending}
          className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80 transition-all"
        >
          <Typography className="text-white font-bold text-base">
            {isPending
              ? "저장 중..."
              : isEditMode
                ? "수정 완료"
                : "여행 등록하기"}
          </Typography>
        </Pressable>
      </Modal.Footer>
    </Modal>
  );
};
