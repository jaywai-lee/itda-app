import { Typography } from "@/components/common/Typography";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-fill" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pb-4 border-b border-line bg-surface">
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 active:opacity-70"
        >
          <ChevronLeft size={28} color={COLORS.ink.DEFAULT} />
        </Pressable>
        <Typography className="text-lg font-bold text-ink">
          개인정보처리방침 및 이용약관
        </Typography>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-5 pt-6 pb-12"
        showsVerticalScrollIndicator={false}
      >
        <Typography className="text-base font-bold text-ink mb-2">
          제1조 (목적)
        </Typography>
        <Typography className="text-sm text-ink-mute leading-6 mb-6">
          본 약관은 '잇다(Itda)' 앱 서비스의 이용과 관련하여 회사와 사용자 간의
          권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </Typography>

        <Typography className="text-base font-bold text-ink mb-2">
          제2조 (개인정보의 처리)
        </Typography>
        <Typography className="text-sm text-ink-mute leading-6 mb-6">
          회사는 원활한 가계부 및 일정 연동 서비스 제공을 위해 최소한의
          개인정보(이메일 등)를 수집하며, 사용자의 동의 없이 제3자에게 제공하지
          않습니다. 입력하신 모든 여행 및 지출 데이터는 안전하게 보관됩니다.
        </Typography>

        <Typography className="text-base font-bold text-ink mb-2">
          제3조 (서비스의 제공 및 변경)
        </Typography>
        <Typography className="text-sm text-ink-mute leading-6 mb-12">
          회사는 환율 정보 연동 및 구글 장소 검색 등 외부 API를 활용한 서비스를
          제공하며, 외부 서비스의 상태에 따라 기능의 일부가 변경되거나 일시
          중단될 수 있습니다.
        </Typography>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
