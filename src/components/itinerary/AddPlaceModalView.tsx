import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Modal } from "../common/Modal";

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
          <Text className="text-sm font-semibold text-slate-text mb-1">
            장소 검색
          </Text>
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
                borderColor: "#E2E8F0",
                borderRadius: 12,
                paddingHorizontal: 12,
                color: "#0F172A",
                backgroundColor: "#FFFFFF",
              },
              listView: {
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                marginTop: 4,
                elevation: 3,
                zIndex: 999,
              },
            }}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-slate-text mb-1">
            방문 날짜
          </Text>
          <Pressable
            onPress={() => handlers.onToggleDatePicker(true)}
            className={`border rounded-xl p-3 bg-white ${
              isDatePickerOpen ? "border-primary" : "border-slate-border"
            }`}
          >
            <Text className="text-slate-text">
              {format(formState.visitDate, "yyyy-MM-dd")}
            </Text>
          </Pressable>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-slate-text mb-1">
            메모 (선택)
          </Text>
          <TextInput
            placeholder="간단한 메모를 남겨보세요"
            value={formState.memo}
            onChangeText={handlers.onChangeMemo}
            className="border border-slate-border rounded-xl p-3 text-slate-text bg-white"
          />
        </View>

        {isDatePickerOpen && Platform.OS === "ios" && (
          <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border border-slate-border rounded-3xl shadow-2xl z-50">
            <View className="flex-row justify-between items-center mb-2 px-2">
              <Text className="text-base font-bold text-slate-text">
                📅 날짜 선택
              </Text>
              <Pressable
                onPress={handlers.onDismissDatePicker}
                className="bg-slate-bg px-4 py-2 rounded-xl active:opacity-80"
              >
                <Text className="text-slate-text font-bold text-sm">닫기</Text>
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
          className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-bold text-base">
            {isPending ? "저장 중..." : "저장하기"}
          </Text>
        </Pressable>
      </Modal.Footer>
    </Modal>
  );
};
