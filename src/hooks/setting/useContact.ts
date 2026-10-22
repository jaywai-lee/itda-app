import { Alert, Linking, Platform } from "react-native";

export const useContact = () => {
  const handleContactUs = async () => {
    const email = "jylee2670@gmail.com";
    const subject = "[잇다] 앱 이용 문의";
    const body = `여기에 문의하실 내용을 작성해 주세요.\n\n\n---\n디바이스 정보: ${Platform.OS} ${Platform.Version}\n---`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
      } else {
        Alert.alert(
          "메일 앱 연결 불가",
          `기본 메일 앱을 열 수 없습니다.\n아래 이메일로 직접 문의해 주세요.\n\n${email}`,
        );
      }
    } catch {
      Alert.alert("오류", "메일 앱 연결 중 문제가 발생했습니다.");
    }
  };

  return { handleContactUs };
};
