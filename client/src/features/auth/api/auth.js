import api from "@/api/axios";

export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const logoutUser = () => api.post("/auth/logout");
export const verifyEmail = (token) => api.post("/auth/verify-email", { token });
export const resendVerifyEmail = (email) =>
  api.post("/auth/resend-verify-email", { email });
