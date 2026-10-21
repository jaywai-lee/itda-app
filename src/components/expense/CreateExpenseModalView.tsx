import { COLORS } from "@/constants/colors";
import { Category } from "@/types/database";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ImageIcon, Trash2 } from "lucide-react-native";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { CategoryIcon } from "../common/CategoryIcon";
import { Modal } from "../common/Modal";
import { Typography } from "../common/Typography";

export interface CreateExpenseFormState {
  amount: string;
  categoryId: string | null;
  memo: string;
  photoUrl: string;
  spentDate: Date;
  isDatePickerOpen: boolean;
}

export interface CreateExpenseFormHandlers {
  onChangeAmount: (text: string) => void;
  onSelectCategory: (id: string) => void;
  onChangeMemo: (text: string) => void;
  onPickImage: () => void;
  onRemoveImage: () => void;
  onToggleDatePicker: (isOpen: boolean) => void;
  onDismissDatePicker: () => void;
  onChangeSpentDate: (event: DateTimePickerChangeEvent, date: Date) => void;
  onSubmit: () => void;
  onDelete: () => void;
}

interface CreateExpenseModalViewProps {
  visible: boolean;
  onClose: () => void;
  currency: string;
  formState: CreateExpenseFormState;
  handlers: CreateExpenseFormHandlers;
  isPending: boolean;
  isEditMode: boolean;
  categories: Category[];
  isLoadingCategories: boolean;
}

export const CreateExpenseModalView = ({
  visible,
  onClose,
  currency,
  formState,
  handlers,
  isPending,
  isEditMode,
  categories,
  isLoadingCategories,
}: CreateExpenseModalViewProps) => {
  const { isDatePickerOpen } = formState;

  const picker = isDatePickerOpen ? (
    <DateTimePicker
      value={formState.spentDate}
      mode="date"
      display={Platform.OS === "ios" ? "inline" : "default"}
      onValueChange={handlers.onChangeSpentDate}
      onDismiss={handlers.onDismissDatePicker}
    />
  ) : null;

  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title={isEditMode ? "지출 수정" : "지출 추가"} />

      <Modal.Body>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="max-h-[65vh]"
        >
          <Typography className="text-sm font-semibold text-ink mb-1">
            금액 ({currency})
          </Typography>
          <TextInput
            placeholder="0"
            keyboardType="numeric"
            value={formState.amount}
            onChangeText={handlers.onChangeAmount}
            placeholderTextColor={COLORS.ink.mute}
            className="border border-line rounded-xl p-3 mb-4 text-ink font-bold text-lg bg-surface"
          />

          <Typography className="text-sm font-semibold text-ink mb-1">
            결제일
          </Typography>
          <Pressable
            onPress={() => handlers.onToggleDatePicker(true)}
            className={`border rounded-xl p-3 mb-4 bg-surface active:bg-fill-strong transition-all ${
              isDatePickerOpen ? "border-primary" : "border-line"
            }`}
          >
            <Typography className="text-ink">
              {format(formState.spentDate, "yyyy-MM-dd")}
            </Typography>
          </Pressable>

          <Typography className="text-sm font-semibold text-ink mb-2">
            카테고리
          </Typography>
          {isLoadingCategories ? (
            <ActivityIndicator
              size="small"
              color={COLORS.primary.DEFAULT}
              className="mb-4"
            />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              className="mb-4"
            >
              {categories.map((cat) => {
                const isSelected = formState.categoryId === cat.id;
                const tint = cat.color || COLORS.primary.DEFAULT;

                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => handlers.onSelectCategory(cat.id)}
                    className="flex-row items-center px-3.5 py-2 rounded-full mr-2 border transition-all"
                    style={{
                      backgroundColor: isSelected ? tint : `${tint}15`,
                      borderColor: isSelected ? tint : `${tint}40`,
                    }}
                  >
                    <CategoryIcon
                      name={cat.icon}
                      color={isSelected ? "#FFFFFF" : tint}
                      size={16}
                    />
                    <Typography
                      className="font-semibold ml-1.5"
                      style={{
                        color: isSelected ? "#FFFFFF" : COLORS.ink.DEFAULT,
                      }}
                    >
                      {cat.name}
                    </Typography>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          <View className="flex-row items-center justify-between mb-1">
            <Typography className="text-sm font-semibold text-ink">
              영수증/사진 첨부
            </Typography>
            {formState.photoUrl ? (
              <Pressable
                onPress={handlers.onRemoveImage}
                className="active:opacity-70 p-1"
              >
                <Typography className="text-xs text-budget-danger font-semibold">
                  삭제
                </Typography>
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={handlers.onPickImage}
            className="border border-line border-dashed rounded-xl mb-4 overflow-hidden items-center justify-center bg-fill h-32 active:bg-fill-strong transition-all"
          >
            {formState.photoUrl ? (
              <Image
                source={{ uri: formState.photoUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <>
                <ImageIcon size={28} color={COLORS.ink.mute} />
                <Typography className="text-ink-mute mt-2 font-semibold">
                  사진 선택하기
                </Typography>
              </>
            )}
          </Pressable>

          <Typography className="text-sm font-semibold text-ink mb-1">
            메모 (선택)
          </Typography>
          <TextInput
            placeholder="어디에 사용하셨나요?"
            value={formState.memo}
            onChangeText={handlers.onChangeMemo}
            placeholderTextColor={COLORS.ink.mute}
            className="border border-line bg-surface rounded-xl p-3 text-ink"
            multiline
          />
        </ScrollView>

        {isDatePickerOpen && Platform.OS === "ios" && (
          <View className="absolute bottom-0 left-0 right-0 bg-surface p-5 border border-line rounded-3xl shadow-2xl z-50">
            <View className="flex-row justify-between items-center mb-2 px-2">
              <Typography className="text-base font-bold text-ink">
                📅 결제일 선택
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

      <View className="flex-row gap-3 pt-2">
        {isEditMode && handlers.onDelete && (
          <Pressable
            onPress={handlers.onDelete}
            className="bg-budget-danger/10 p-4 rounded-xl items-center justify-center px-6 active:opacity-80 transition-all"
          >
            <Trash2 size={20} color={COLORS.budget.danger} />
          </Pressable>
        )}
        <Pressable
          onPress={handlers.onSubmit}
          disabled={isPending}
          className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80 transition-all"
        >
          <Typography className="text-white font-bold text-base">
            {isPending
              ? "처리 중..."
              : isEditMode
                ? "수정 완료"
                : "지출 등록하기"}
          </Typography>
        </Pressable>
      </View>
    </Modal>
  );
};
