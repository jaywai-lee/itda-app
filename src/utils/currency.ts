export const fetchExchangeRate = async (
  baseCurrency: string,
): Promise<number> => {
  if (baseCurrency.toUpperCase() === "KRW") return 1;

  try {
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${baseCurrency}`,
    );
    const data = await response.json();

    if (data.result === "success" && data.rates["KRW"]) {
      return data.rates["KRW"];
    }

    throw new Error("지원하지 않는 통화이거나 환율 정보를 찾을 수 없습니다.");
  } catch (error) {
    console.error("환율 API 호출 실패:", error);
    throw new Error("환율 정보를 불러오는 데 실패했습니다.");
  }
};
