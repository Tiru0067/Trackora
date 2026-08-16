import api from "@/api/axios";

export const getDashboardData = async (range = "30d") => {
  const { data } = await api.get(`/dashboard?range=${range}`);
  return data.data;
};
