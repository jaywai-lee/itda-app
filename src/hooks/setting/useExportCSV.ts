import { supabase } from "@/services/supabase";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert } from "react-native";

type ExportExpenseRow = {
  spent_at: string;
  amount: number;
  currency: string;
  amount_krw: number;
  memo: string | null;
  trips: { name: string } | null;
  categories: { name: string } | null;
};

export const useExportCSV = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);

      const { data, error } = await supabase
        .from("expenses")
        .select(
          `
          spent_at,
          amount,
          currency,
          amount_krw,
          memo,
          trips ( name ),
          categories ( name )
        `,
        )
        .order("spent_at", { ascending: false })
        .overrideTypes<ExportExpenseRow[], { merge: false }>();

      if (error) throw new Error(error.message);

      if (!data || data.length === 0) {
        Alert.alert("알림", "내보낼 지출 내역이 없습니다.");
        return;
      }

      const header = "날짜,여행명,카테고리,지출금액,통화,원화환산금액,메모\n";

      const rows = data.map((item) => {
        const date = item.spent_at ? item.spent_at.split("T")[0] : "";
        const tripName = item.trips?.name || "알 수 없음";
        const category = item.categories?.name || "기타";
        const amount = item.amount || 0;
        const currency = item.currency || "";
        const amountKrw = item.amount_krw || 0;
        const memo = item.memo ? item.memo.replace(/,/g, " ") : "";

        return `${date},${tripName},${category},${amount},${currency},${amountKrw},${memo}`;
      });

      const csvContent = "\uFEFF" + header + rows.join("\n");
      const file = new File(Paths.document, "itda_account_book.csv");
      file.write(csvContent);

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "text/csv",
          dialogTitle: "가계부 데이터 내보내기",
          UTI: "public.comma-separated-values-text",
        });
      } else {
        Alert.alert("알림", "이 기기에서는 공유 기능을 사용할 수 없습니다.");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      Alert.alert("오류", `CSV 내보내기 실패: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  return { handleExportCSV, isExporting };
};
