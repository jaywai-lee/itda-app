import {
  CATEGORY_COLORS,
  CATEGORY_ICON_KEYS,
  CATEGORY_ICONS,
} from "@/constants/categoryPresets";
import { COLORS } from "@/constants/colors";
import { Category } from "@/types/database";
import { ChevronLeft, Lock, Plus, Trash2 } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryIcon } from "../common/CategoryIcon";
import { Modal } from "../common/Modal";

export interface CategorySettingsFormState {
  name: string;
  color: string;
  iconName: string;
}

export interface CategorySettingsViewState {
  categories: Category[];
  isLoading: boolean;
  isModalVisible: boolean;
  editTarget: Category | null;
  form: CategorySettingsFormState;
  isPending: boolean;
}

export interface CategorySettingsViewHandlers {
  onGoBack: () => void;
  onOpenModal: (category?: Category) => void;
  onCloseModal: () => void;
  onSubmit: () => void;
  onDelete: (id: string) => void;
  onChangeName: (text: string) => void;
  onChangeColor: (color: string) => void;
  onChangeIconName: (iconName: string) => void;
}

interface CategorySettingsViewProps {
  state: CategorySettingsViewState;
  handlers: CategorySettingsViewHandlers;
}

export const CategorySettingsView = ({
  state,
  handlers,
}: CategorySettingsViewProps) => {
  const insets = useSafeAreaInsets();
  const myCategories = state.categories.filter((c) => c.user_id !== null);
  const defaultCategories = state.categories.filter((c) => c.user_id === null);

  return (
    <View className="flex-1 bg-slate-bg" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pb-4 border-b border-slate-border bg-white">
        <Pressable
          onPress={handlers.onGoBack}
          className="p-2 -ml-2 active:opacity-70"
        >
          <ChevronLeft size={28} color={COLORS.slate.text} />
        </Pressable>
        <Text className="text-lg font-bold text-slate-text">
          카테고리 커스터마이징
        </Text>
        <Pressable
          onPress={() => handlers.onOpenModal()}
          className="p-2 -mr-2 active:opacity-70"
        >
          <Plus size={24} color={COLORS.primary.DEFAULT} />
        </Pressable>
      </View>

      {state.isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
        </View>
      ) : (
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <Text className="text-sm font-semibold text-slate-text mb-3 ml-1">
            내 카테고리
          </Text>
          {myCategories.length === 0 ? (
            <View className="bg-white p-6 rounded-2xl border border-slate-border mb-6 items-center shadow-sm">
              <Text className="text-slate-inactive text-sm font-medium">
                아직 만든 카테고리가 없어요.
              </Text>
              <Text className="text-slate-inactive text-xs mt-1">
                오른쪽 위 + 버튼으로 추가해 보세요!
              </Text>
            </View>
          ) : (
            myCategories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => handlers.onOpenModal(cat)}
                className="bg-white p-4 rounded-xl border border-slate-border mb-3 flex-row items-center shadow-sm active:opacity-70"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-4"
                  style={{
                    backgroundColor: `${cat.color || COLORS.slate.inactive}20`,
                  }}
                >
                  <CategoryIcon name={cat.icon} color={cat.color} size={20} />
                </View>
                <Text className="text-base font-bold text-slate-text flex-1">
                  {cat.name}
                </Text>
                <Pressable
                  onPress={() => handlers.onDelete(cat.id)}
                  disabled={state.isPending}
                  className="p-2 active:opacity-60 bg-red-50 rounded-full"
                >
                  <Trash2 size={18} color={COLORS.budget.danger} />
                </Pressable>
              </Pressable>
            ))
          )}

          <Text className="text-sm font-semibold text-slate-text mb-3 ml-1 mt-4">
            기본 카테고리
          </Text>
          {defaultCategories.map((cat) => (
            <Pressable
              key={cat.id}
              disabled
              className="bg-white p-4 rounded-xl border border-slate-border mb-3 flex-row items-center shadow-sm opacity-80"
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-4"
                style={{
                  backgroundColor: `${cat.color || COLORS.slate.inactive}20`,
                }}
              >
                <CategoryIcon name={cat.icon} color={cat.color} size={20} />
              </View>
              <Text className="text-base font-bold text-slate-text flex-1">
                {cat.name}
              </Text>
              <View className="p-2 flex-row items-center">
                <Text className="text-xs text-slate-inactive mr-1">기본</Text>
                <Lock size={16} color={COLORS.slate.inactive} />
              </View>
            </Pressable>
          ))}
          <View className="h-10" />
        </ScrollView>
      )}

      <Modal visible={state.isModalVisible} onClose={handlers.onCloseModal}>
        <Modal.Header
          title={state.editTarget ? "카테고리 수정" : "새 카테고리"}
        />
        <Modal.Body>
          <ScrollView
            className="max-h-[60vh]"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-sm font-semibold text-slate-text mb-2">
              이름
            </Text>
            <TextInput
              value={state.form.name}
              onChangeText={handlers.onChangeName}
              placeholder="예: 간식비"
              className="border border-slate-border rounded-xl p-3 text-slate-text mb-6 font-semibold"
            />

            <Text className="text-sm font-semibold text-slate-text mb-2">
              색상 선택
            </Text>
            <View className="flex-row flex-wrap gap-3 mb-6">
              {CATEGORY_COLORS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => handlers.onChangeColor(c)}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: c,
                    borderWidth: state.form.color === c ? 3 : 0,
                    borderColor: "#334155",
                  }}
                />
              ))}
            </View>

            <Text className="text-sm font-semibold text-slate-text mb-2">
              아이콘 선택
            </Text>
            <View className="flex-row flex-wrap gap-4 pb-4">
              {CATEGORY_ICON_KEYS.map((key) => {
                const isSelected = state.form.iconName === key;
                const IconComp = CATEGORY_ICONS[key];
                return (
                  <Pressable
                    key={key}
                    onPress={() => handlers.onChangeIconName(key)}
                    className="w-12 h-12 rounded-xl items-center justify-center border"
                    style={{
                      backgroundColor: isSelected
                        ? state.form.color
                        : undefined,
                      borderColor: isSelected
                        ? state.form.color
                        : COLORS.slate.border,
                    }}
                  >
                    <IconComp
                      size={24}
                      color={isSelected ? "#FFFFFF" : COLORS.slate.inactive}
                    />
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </Modal.Body>
        <Modal.Footer>
          <Pressable
            onPress={handlers.onSubmit}
            disabled={state.isPending}
            className="flex-1 bg-primary p-4 rounded-xl items-center active:opacity-80"
          >
            <Text className="text-white font-bold text-base">
              {state.isPending ? "저장 중..." : "저장하기"}
            </Text>
          </Pressable>
        </Modal.Footer>
      </Modal>
    </View>
  );
};
