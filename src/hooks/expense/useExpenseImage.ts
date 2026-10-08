import { Expense } from "@/types/database";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export const useExpenseImage = (
  visible: boolean,
  editTarget?: Expense | null,
) => {
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (visible) {
      setPhotoUrl(editTarget?.photo_url || "");
    }
  }, [visible, editTarget]);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "권한 필요",
        "사진을 첨부하려면 갤러리 접근 권한이 필요합니다.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setPhotoUrl("");
  };

  return {
    photoUrl,
    handlePickImage,
    handleRemoveImage,
  };
};
