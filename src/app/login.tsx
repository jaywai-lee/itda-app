import { COLORS } from "@/constants/colors";
import { supabase } from "@/services/supabase";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("로그인 실패", error.message);
    } else {
      router.replace("/");
    }
    setLoading(false);
  };

  const handleOAuthLogin = (provider: string) => {
    // 추후 supabase OAuth 로직이 연결될 자리
    Alert.alert("알림", `${provider} 로그인은 곧 지원될 예정입니다.`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-bg"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-10 mt-10">
          <Image
            source={require("../../assets/images/icon.png")}
            className="w-24 h-24 mb-4 rounded-3xl"
            resizeMode="contain"
          />
          <Text className="text-3xl font-extrabold text-slate-text tracking-tight mb-1">
            잇다
          </Text>
          <Text className="text-sm text-slate-inactive font-medium">
            여정과 지출을 잇는 스마트한 여행 가계부
          </Text>
        </View>

        <View className="space-y-4 mb-6">
          <TextInput
            className="bg-white border border-slate-border rounded-2xl p-4 text-base text-slate-text font-medium"
            placeholder="이메일 주소"
            placeholderTextColor={COLORS.slate.inactive || "#94A3B8"}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            className="bg-white border border-slate-border rounded-2xl p-4 text-base text-slate-text font-medium mt-3"
            placeholder="비밀번호"
            placeholderTextColor={COLORS.slate.inactive || "#94A3B8"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <Pressable
          onPress={handleEmailLogin}
          disabled={loading}
          className="bg-primary p-4 rounded-2xl items-center active:opacity-80 shadow-sm"
        >
          <Text className="text-white font-bold text-base">로그인</Text>
        </Pressable>

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-slate-border" />
          <Text className="mx-4 text-xs font-medium text-slate-inactive">
            또는
          </Text>
          <View className="flex-1 h-[1px] bg-slate-border" />
        </View>

        <View className="space-y-3 mb-10">
          <Pressable
            onPress={() => handleOAuthLogin("Google")}
            className="bg-white border border-slate-border p-4 rounded-2xl items-center active:opacity-60 mb-3"
          >
            <Text className="text-slate-text font-bold text-base">G</Text>
          </Pressable>

          <Pressable
            onPress={() => handleOAuthLogin("Kakao")}
            className="bg-[#000000] p-4 rounded-2xl items-center active:opacity-80"
          >
            <Text className="text-slate-text font-bold text-base">K</Text>
          </Pressable>
        </View>

        <View className="flex-row justify-center items-center mt-auto mb-4">
          <Text className="text-sm text-slate-inactive font-medium">
            아직 계정이 없으신가요?
          </Text>
          <Pressable onPress={() => router.push("/signup")} className="p-1">
            <Text className="text-sm font-bold text-primary">회원가입</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
