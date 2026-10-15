import { ChangePasswordModal } from "@/components/setting/ChangePasswordModal";
import { CountrySelectModal } from "@/components/setting/CountrySelectModal";
import { SettingItem } from "@/components/setting/SettingItem";
import { COLORS } from "@/constants/colors";
import { useChangePasswordModal } from "@/hooks/auth/useChangePasswordModal";
import { useUserSettings } from "@/hooks/auth/useUserSettings";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { Href } from "expo-router";
import {
  AlertTriangle,
  Bell,
  ChevronLeft,
  Download,
  FileText,
  Globe,
  Info,
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  Settings2,
  User,
  UserX,
} from "lucide-react-native";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type UserSettingsHook = ReturnType<typeof useUserSettings>;
type PwModalHook = ReturnType<typeof useChangePasswordModal>;

export interface SettingsViewState {
  userEmail: string;
  settings: UserSettingsHook["settings"];
  isUpdating: boolean;
  isDeleting: boolean;
  isCountryModalVisible: boolean;
  isTimePickerVisible: boolean;
  reminderDraftTime: Date | null;
  pwModalState: PwModalHook["state"];
}

export interface SettingsViewHandlers {
  onGoBack: () => void;
  onNavigate: (path: Href) => void;
  onComingSoon: (feature: string) => void;
  onToggleKrwConversion: () => void;
  onSelectDefaultCountry: (country: string, currency: string) => void;
  onToggleReminder: () => void;
  onToggleCountryModal: (visible: boolean) => void;
  onToggleTimePicker: (visible: boolean) => void;
  onChangeReminderTime: (event: DateTimePickerChangeEvent, date: Date) => void;
  onConfirmTimePicker: () => void;
  onDismissTimePicker: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  pwModalHandlers: PwModalHook["handlers"];
}

interface SettingsViewProps {
  state: SettingsViewState;
  handlers: SettingsViewHandlers;
}

export const SettingsView = ({ state, handlers }: SettingsViewProps) => {
  const insets = useSafeAreaInsets();

  const getReminderDate = () => {
    const d = new Date();
    const [h, m] = state.settings.reminderTime.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const timePicker = state.isTimePickerVisible ? (
    <DateTimePicker
      value={state.reminderDraftTime ?? getReminderDate()}
      mode="time"
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onValueChange={handlers.onChangeReminderTime}
      onDismiss={handlers.onDismissTimePicker}
      style={{ alignSelf: "center" }}
    />
  ) : null;

  return (
    <View className="flex-1 bg-slate-bg" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pb-4 border-b border-slate-border bg-white">
        <Pressable
          onPress={handlers.onGoBack}
          className="p-2 -ml-2 active:opacity-70"
        >
          <ChevronLeft size={28} color={COLORS.slate.text} />
        </Pressable>
        <Text className="text-lg font-bold text-slate-text">설정</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 pt-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xs font-bold text-slate-inactive ml-5 mb-2">
          계정
        </Text>
        <View className="bg-white border-y border-slate-border mb-6">
          <SettingItem
            icon={<User size={20} color={COLORS.slate.inactive} />}
            label="로그인 정보"
            value={state.userEmail}
            hideChevron
          />
          <SettingItem
            icon={<Lock size={20} color={COLORS.slate.inactive} />}
            label="비밀번호 변경"
            onPress={handlers.pwModalHandlers.openModal}
            isLast
          />
        </View>

        <Text className="text-xs font-bold text-slate-inactive ml-5 mb-2">
          여행
        </Text>
        <View className="bg-white border-y border-slate-border mb-6">
          <SettingItem
            icon={<Settings2 size={20} color={COLORS.slate.inactive} />}
            label="카테고리 커스터마이징"
            onPress={() => handlers.onNavigate("/settings/categories")}
          />
          <SettingItem
            icon={<Globe size={20} color={COLORS.slate.inactive} />}
            label="기본 국가/통화 설정"
            value={`${state.settings.defaultCountry} (${state.settings.defaultCurrency})`}
            onPress={() => handlers.onToggleCountryModal(true)}
            disabled={state.isUpdating}
          />
          <SettingItem
            icon={<RefreshCw size={20} color={COLORS.slate.inactive} />}
            label="원화 환산 표시"
            value={state.settings.showKrwConversion ? "켜짐" : "꺼짐"}
            onPress={handlers.onToggleKrwConversion}
            disabled={state.isUpdating}
            isLast
          />
        </View>

        <Text className="text-xs font-bold text-slate-inactive ml-5 mb-2">
          알림
        </Text>
        <View className="bg-white border-y border-slate-border mb-6">
          <SettingItem
            icon={<Bell size={20} color={COLORS.slate.inactive} />}
            label="지출 기록 리마인더"
            value={state.settings.isReminderEnabled ? "켜짐" : "꺼짐"}
            onPress={handlers.onToggleReminder}
            disabled={state.isUpdating}
          />
          {state.settings.isReminderEnabled && (
            <SettingItem
              icon={<Bell size={20} color={COLORS.slate.inactive} />}
              label="리마인더 시간 설정"
              value={state.settings.reminderTime}
              onPress={() => handlers.onToggleTimePicker(true)}
              disabled={state.isUpdating}
            />
          )}
          <SettingItem
            icon={<AlertTriangle size={20} color={COLORS.slate.inactive} />}
            label="예산 경고 기준"
            value="80%"
            onPress={() => handlers.onComingSoon("예산 경고 기준 설정")}
            isLast
          />
        </View>

        <Text className="text-xs font-bold text-slate-inactive ml-5 mb-2">
          데이터
        </Text>
        <View className="bg-white border-y border-slate-border mb-6">
          <SettingItem
            icon={<Download size={20} color={COLORS.slate.inactive} />}
            label="가계부 데이터 내보내기 (CSV)"
            onPress={() => handlers.onComingSoon("CSV 내보내기")}
            isLast
          />
        </View>

        <Text className="text-xs font-bold text-slate-inactive ml-5 mb-2">
          정보
        </Text>
        <View className="bg-white border-y border-slate-border mb-8">
          <SettingItem
            icon={<Mail size={20} color={COLORS.slate.inactive} />}
            label="문의하기"
            onPress={() => handlers.onComingSoon("문의 이메일 연결")}
          />
          <SettingItem
            icon={<FileText size={20} color={COLORS.slate.inactive} />}
            label="개인정보처리방침 및 이용약관"
            onPress={() => handlers.onComingSoon("약관 링크 연결")}
          />
          <SettingItem
            icon={<Info size={20} color={COLORS.slate.inactive} />}
            label="앱 버전"
            value="1.0.0"
            hideChevron
            isLast
          />
        </View>

        <View className="bg-white border-y border-slate-border mt-8 mb-12">
          <SettingItem
            icon={<LogOut size={20} color={COLORS.slate.text} />}
            label="로그아웃"
            onPress={handlers.onLogout}
            disabled={state.isDeleting}
          />
          <SettingItem
            icon={<UserX size={20} color={COLORS.budget.danger} />}
            label={state.isDeleting ? "처리 중..." : "회원 탈퇴"}
            isDanger
            onPress={handlers.onDeleteAccount}
            isLast
            disabled={state.isDeleting}
          />
        </View>
      </ScrollView>

      <ChangePasswordModal
        state={state.pwModalState}
        handlers={handlers.pwModalHandlers}
      />

      <CountrySelectModal
        visible={state.isCountryModalVisible}
        onClose={() => handlers.onToggleCountryModal(false)}
        currentCountry={state.settings.defaultCountry}
        onSelect={handlers.onSelectDefaultCountry}
        isUpdating={state.isUpdating}
      />

      {state.isTimePickerVisible && Platform.OS === "ios" && (
        <>
          <Pressable
            onPress={handlers.onDismissTimePicker}
            className="absolute inset-0 z-40"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-slate-border rounded-t-3xl shadow-2xl z-50">
            <View className="flex-row justify-between items-center mb-2 px-2">
              <Text className="text-base font-bold text-slate-text">
                ⏰ 시간 설정
              </Text>
              <Pressable
                onPress={handlers.onConfirmTimePicker}
                className="bg-slate-bg px-4 py-2 rounded-xl active:opacity-80"
              >
                <Text className="text-slate-text font-bold text-sm">확인</Text>
              </Pressable>
            </View>

            <View className="w-full items-center justify-center py-4">
              {timePicker}
            </View>
          </View>
        </>
      )}

      {state.isTimePickerVisible && Platform.OS === "android" && timePicker}
    </View>
  );
};
