import api from "@/api/axios";

export const getUser = () => api.get("/auth/me");
