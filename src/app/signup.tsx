import { Typography } from "@/components/common/Typography";
import { COLORS } from "@/constants/colors";
import { supabase } from "@/services/supabase";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("알림", "모든 항목을 입력해 주세요.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("알림", "비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert("회원가입 실패", error.message);
    } else {
      Alert.alert("가입 완료", "회원가입이 성공적으로 완료되었습니다.", [
        { text: "확인", onPress: () => router.replace("/") },
      ]);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-canvas"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-10 items-center">
          <Typography className="text-3xl font-extrabold text-ink tracking-tight mb-2">
            회원가입
          </Typography>
          <Typography className="text-sm text-ink-sub font-medium">
            잇다의 멤버가 되어 스마트한 여행을 시작하세요.
          </Typography>
        </View>

        <View className="space-y-4 mb-8">
          <View className="mb-4">
            <Typography className="text-xs font-bold text-ink-mute mb-2 ml-1">
              이메일 주소
            </Typography>
            <TextInput
              className="bg-fill border border-line rounded-2xl p-4 text-base text-ink font-medium"
              placeholder="example@itda.com"
              placeholderTextColor={COLORS.ink?.mute || "#94a3b8"}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="mb-4">
            <Typography className="text-xs font-bold text-ink-mute mb-2 ml-1">
              비밀번호
            </Typography>
            <TextInput
              className="bg-fill border border-line rounded-2xl p-4 text-base text-ink font-medium"
              placeholder="비밀번호를 입력하세요"
              placeholderTextColor={COLORS.ink?.mute || "#94a3b8"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View>
            <Typography className="text-xs font-bold text-ink-mute mb-2 ml-1">
              비밀번호 확인
            </Typography>
            <TextInput
              className="bg-fill border border-line rounded-2xl p-4 text-base text-ink font-medium"
              placeholder="비밀번호를 다시 한 번 입력하세요"
              placeholderTextColor={COLORS.ink?.mute || "#94a3b8"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </View>

        <View className="mb-6">
          <Pressable
            onPress={handleSignUp}
            disabled={loading}
            className="bg-primary p-4 rounded-2xl items-center active:opacity-80 shadow-sm"
          >
            <Typography className="text-white font-bold text-base">
              가입하기
            </Typography>
          </Pressable>
        </View>

        <View className="flex-row justify-center items-center">
          <Typography className="text-sm text-ink-sub font-medium">
            이미 계정이 있으신가요?
          </Typography>
          <Pressable onPress={() => router.back()} className="p-1 ml-1">
            <Typography className="text-sm font-bold text-primary">
              로그인
            </Typography>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
