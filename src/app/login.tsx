import { supabase } from "@/services/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (isSignUp: boolean) => {
    setLoading(true);
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert("인증 실패", error.message);
    } else {
      router.replace("/");
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center p-6 bg-slate-bg">
      <Text className="text-3xl font-bold text-slate-text mb-8 text-center">
        잇다(Itda)
      </Text>

      <TextInput
        className="bg-white border border-slate-border rounded-xl p-4 mb-3 text-slate-text"
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="bg-white border border-slate-border rounded-xl p-4 mb-3 text-slate-text"
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        onPress={() => handleAuth(false)}
        disabled={loading}
        className="bg-primary p-4 rounded-xl items-center mb-3 active:opacity-80"
      >
        <Text className="text-white font-bold text-base">로그인</Text>
      </Pressable>

      <Pressable
        onPress={() => handleAuth(true)}
        disabled={loading}
        className="bg-slate-border p-4 rounded-xl items-center active:opacity-80"
      >
        <Text className="text-slate-text font-bold text-base">
          간편 회원가입
        </Text>
      </Pressable>
    </View>
  );
}
