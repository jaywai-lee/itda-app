import { COLORS } from "@/constants/colors";
import { Category } from "@/types/database";
import { ImageIcon, Trash2 } from "lucide-react-native";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Modal } from "../common/Modal";

export interface CreateExpenseFormState {
  amount: string;
  categoryId: string | null;
  memo: string;
  photoUrl: string;
}

export interface CreateExpenseFormHandlers {
  onChangeAmount: (text: string) => void;
  onSelectCategory: (id: string) => void;
  onChangeMemo: (text: string) => void;
  onPickImage: () => void;
  onRemoveImage: () => void;
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
  return (
    <Modal visible={visible} onClose={onClose}>
      <Modal.Header title={isEditMode ? "지출 수정" : "지출 추가"} />

      <Modal.Body>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="max-h-[70vh]"
        >
          <Text className="text-sm font-semibold text-slate-text mb-1">
            금액 ({currency})
          </Text>
          <TextInput
            placeholder="0"
            keyboardType="numeric"
            value={formState.amount}
            onChangeText={handlers.onChangeAmount}
            className="border border-slate-border rounded-xl p-3 mb-4 text-slate-text font-bold text-lg"
          />

          <Text className="text-sm font-semibold text-slate-text mb-2">
            카테고리
          </Text>
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
              className="mb-4"
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => handlers.onSelectCategory(cat.id)}
                  className={`px-4 py-2 rounded-full mr-2 border ${
                    formState.categoryId === cat.id
                      ? "bg-primary border-primary"
                      : "bg-slate-bg border-slate-border"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      formState.categoryId === cat.id
                        ? "text-white"
                        : "text-slate-text"
                    }`}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-sm font-semibold text-slate-text">
              영수증/사진 첨부
            </Text>
            {formState.photoUrl ? (
              <Pressable
                onPress={handlers.onRemoveImage}
                className="active:opacity-70"
              >
                <Text className="text-xs text-budget-danger font-semibold">
                  삭제
                </Text>
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={handlers.onPickImage}
            className="border border-slate-border border-dashed rounded-xl mb-4 overflow-hidden items-center justify-center bg-slate-bg h-32 active:opacity-70"
          >
            {formState.photoUrl ? (
              <Image
                source={{ uri: formState.photoUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <>
                <ImageIcon size={28} color={COLORS.slate.inactive} />
                <Text className="text-slate-inactive mt-2 font-semibold">
                  사진 선택하기
                </Text>
              </>
            )}
          </Pressable>

          <Text className="text-sm font-semibold text-slate-text mb-1">
            메모 (선택)
          </Text>
          <TextInput
            placeholder="어디에 사용하셨나요?"
            value={formState.memo}
            onChangeText={handlers.onChangeMemo}
            className="border border-slate-border rounded-xl p-3 text-slate-text"
            multiline
          />
        </ScrollView>
      </Modal.Body>

      <View className="flex-row gap-3">
        {isEditMode && handlers.onDelete && (
          <Pressable
            onPress={handlers.onDelete}
            className="bg-budget-danger/10 p-4 rounded-xl items-center justify-center px-6 active:opacity-80"
          >
            <Trash2 size={20} color={COLORS.budget.danger} />
          </Pressable>
        )}
        <Pressable
          onPress={handlers.onSubmit}
          disabled={isPending}
          className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80"
        >
          <Text className="text-white font-bold text-base">
            {isPending
              ? "처리 중..."
              : isEditMode
                ? "수정 완료"
                : "지출 등록하기"}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};
