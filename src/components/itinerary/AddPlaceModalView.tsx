import { COLORS } from "@/constants/colors";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Platform, Pressable, TextInput, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Modal } from "../common/Modal";
import { Typography } from "../common/Typography";

export interface AddPlaceFormState {
  placeName: string;
  lat: number | null;
  lng: number | null;
  visitDate: Date;
  memo: string;
  isDatePickerOpen: boolean;
}

export interface AddPlaceFormHandlers {
  onPlaceSelect: (name: string, lat: number, lng: number) => void;
  onChangeMemo: (text: string) => void;
  onToggleDatePicker: (isOpen: boolean) => void;
  onChangeDate: (event: DateTimePickerChangeEvent, date: Date) => void;
  onDismissDatePicker: () => void;
  onSubmit: () => void;
}

interface AddPlaceModalViewProps {
  visible: boolean;
  onClose: () => void;
  formState: AddPlaceFormState;
  handlers: AddPlaceFormHandlers;
  isPending?: boolean;
  isEditMode?: boolean;
}

export const AddPlaceModalView = ({
  visible,
  onClose,
  formState,
  handlers,
  isPending = false,
  isEditMode = false,
}: AddPlaceModalViewProps) => {
  const { isDatePickerOpen } = formState;

  const picker = isDatePickerOpen ? (
    <DateTimePicker
      value={formState.visitDate}
      mode="date"
      display={Platform.OS === "ios" ? "inline" : "default"}
      onValueChange={handlers.onChangeDate}
      onDismiss={handlers.onDismissDatePicker}
    />
  ) : null;

  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title={isEditMode ? "장소 수정" : "장소 추가"} />

      <Modal.Body>
        <View className="mb-4 z-50 h-64">
          <Typography className="text-sm font-semibold text-ink mb-1">
            장소 검색
          </Typography>
          <GooglePlacesAutocomplete
            placeholder="어디를 방문하실 예정이신가요?"
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (details) {
                handlers.onPlaceSelect(
                  details.name || data.structured_formatting.main_text,
                  details.geometry.location.lat,
                  details.geometry.location.lng,
                );
              }
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
              language: "ko",
            }}
            styles={{
              container: { flex: 0 },
              textInputContainer: { width: "100%", paddingBottom: 0 },
              textInput: {
                height: 48,
                borderWidth: 1,
                borderColor: COLORS.line,
                borderRadius: 12,
                paddingHorizontal: 12,
                color: COLORS.ink.DEFAULT,
                backgroundColor: COLORS.surface,
              },
              listView: {
                backgroundColor: COLORS.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: COLORS.line,
                marginTop: 4,
                elevation: 3,
                zIndex: 999,
              },
            }}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        <View className="mb-4">
          <Typography className="text-sm font-semibold text-ink mb-1">
            방문 날짜
          </Typography>
          <Pressable
            onPress={() => handlers.onToggleDatePicker(true)}
            className={`border rounded-xl p-3 bg-surface active:bg-fill-strong transition-all ${
              isDatePickerOpen ? "border-primary" : "border-line"
            }`}
          >
            <Typography className="text-ink">
              {format(formState.visitDate, "yyyy-MM-dd")}
            </Typography>
          </Pressable>
        </View>

        <View className="mb-4">
          <Typography className="text-sm font-semibold text-ink mb-1">
            메모 (선택)
          </Typography>
          <TextInput
            placeholder="간단한 메모를 남겨보세요"
            value={formState.memo}
            onChangeText={handlers.onChangeMemo}
            placeholderTextColor={COLORS.ink.mute}
            className="border border-line rounded-xl p-3 text-ink bg-surface"
          />
        </View>

        {isDatePickerOpen && Platform.OS === "ios" && (
          <View className="absolute bottom-0 left-0 right-0 bg-surface p-5 border border-line rounded-3xl shadow-2xl z-50">
            <View className="flex-row justify-between items-center mb-2 px-2">
              <Typography className="text-base font-bold text-ink">
                📅 날짜 선택
              </Typography>
              <Pressable
                onPress={handlers.onDismissDatePicker}
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

        {isDatePickerOpen && Platform.OS === "android" && picker}
      </Modal.Body>

      <Modal.Footer>
        <Pressable
          onPress={handlers.onSubmit}
          disabled={isPending}
          className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80 transition-all"
        >
          <Typography className="text-white font-bold text-base">
            {isPending ? "저장 중..." : "저장하기"}
          </Typography>
        </Pressable>
      </Modal.Footer>
    </Modal>
  );
};
