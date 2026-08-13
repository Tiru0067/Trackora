import api from "@/api/axios";

export const getCurrencies = async () => {
  const response = await api.get("/currencies");
  return response.data.data;
};

export const getExchangeRates = async () => {
  const response = await api.get("/exchange-rates");
  return response.data.data;
};
