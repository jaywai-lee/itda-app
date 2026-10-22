import { Typography } from "@/components/common/Typography";
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
        <View className="items-center mb-10">
          <Image
            source={require("../../assets/images/icon.png")}
            className="w-24 h-24 mb-4 rounded-[24px]"
            resizeMode="contain"
          />
          <Typography className="text-3xl font-extrabold text-ink tracking-tight mb-1">
            잇다
          </Typography>
          <Typography className="text-sm text-ink-sub font-medium">
            여정과 지출을 잇는 스마트한 여행 가계부
          </Typography>
        </View>

        <View className="space-y-4 mb-6">
          <TextInput
            className="bg-fill border border-line rounded-2xl p-4 text-base text-ink font-medium"
            placeholder="이메일 주소"
            placeholderTextColor={COLORS.ink?.mute || "#94A3B8"}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            className="bg-fill border border-line rounded-2xl p-4 text-base text-ink font-medium mt-3"
            placeholder="비밀번호"
            placeholderTextColor={COLORS.ink?.mute || "#94A3B8"}
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
          <Typography className="text-white font-bold text-base">
            로그인
          </Typography>
        </Pressable>

        <View className="flex-row justify-center items-center mt-6">
          <Typography className="text-sm text-ink-sub font-medium">
            아직 계정이 없으신가요?
          </Typography>
          <Pressable
            onPress={() => router.push("/signup")}
            className="p-1 ml-1"
          >
            <Typography className="text-sm font-bold text-primary">
              회원가입
            </Typography>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
