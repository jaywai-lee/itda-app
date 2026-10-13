import { ChangePasswordModal } from "@/components/setting/ChangePasswordModal";
import { SettingItem } from "@/components/setting/SettingItem";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useAuthActions } from "@/hooks/auth/useAuthActions";
import { useChangePasswordModal } from "@/hooks/auth/useChangePasswordModal";
import { router } from "expo-router";
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
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const userEmail = session?.user?.email || "이메일 정보 없음";

  const { handleLogout, handleDeleteAccount, isDeleting } = useAuthActions();
  const pwModal = useChangePasswordModal();

  const handleComingSoon = (feature: string) => {
    Alert.alert("알림", `${feature} 기능은 곧 업데이트될 예정입니다.`);
  };

  return (
    <View className="flex-1 bg-slate-bg" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pb-4 border-b border-slate-border bg-white">
        <Pressable
          onPress={() => router.back()}
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
            value={userEmail}
            hideChevron
          />
          <SettingItem
            icon={<Lock size={20} color={COLORS.slate.inactive} />}
            label="비밀번호 변경"
            onPress={pwModal.handlers.openModal}
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
            onPress={() => router.push("/settings/categories")}
          />
          <SettingItem
            icon={<Globe size={20} color={COLORS.slate.inactive} />}
            label="기본 국가/통화 설정"
            onPress={() => handleComingSoon("기본 국가 설정")}
          />
          <SettingItem
            icon={<RefreshCw size={20} color={COLORS.slate.inactive} />}
            label="원화 환산 표시"
            value="켜짐"
            onPress={() => handleComingSoon("원화 환산 표시 옵션")}
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
            value="오후 8:00"
            onPress={() => handleComingSoon("리마인더 설정")}
          />
          <SettingItem
            icon={<AlertTriangle size={20} color={COLORS.slate.inactive} />}
            label="예산 경고 기준"
            value="80%"
            onPress={() => handleComingSoon("예산 경고 기준 설정")}
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
            onPress={() => handleComingSoon("CSV 내보내기")}
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
            onPress={() => handleComingSoon("문의 이메일 연결")}
          />
          <SettingItem
            icon={<FileText size={20} color={COLORS.slate.inactive} />}
            label="개인정보처리방침 및 이용약관"
            onPress={() => handleComingSoon("약관 링크 연결")}
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
            onPress={handleLogout}
            disabled={isDeleting}
          />
          <SettingItem
            icon={<UserX size={20} color={COLORS.budget.danger} />}
            label={isDeleting ? "처리 중..." : "회원 탈퇴"}
            isDanger
            onPress={handleDeleteAccount}
            isLast
            disabled={isDeleting}
          />
        </View>
      </ScrollView>

      <ChangePasswordModal state={pwModal.state} handlers={pwModal.handlers} />
    </View>
  );
}
