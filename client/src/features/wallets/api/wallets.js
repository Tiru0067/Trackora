import api from "@/api/axios";

export const walletsApi = {
  /**
   * Fetch all wallets for the authenticated user
   */
  getAll: async () => {
    const response = await api.get("/wallets");
    return response.data.data;
  },

  /**
   * Fetch a single wallet by ID
   */
  getById: async (id) => {
    const response = await api.get(`/wallets/${id}`);
    return response.data.data;
  },

  /**
   * Create a new wallet
   */
  create: async (data) => {
    const response = await api.post("/wallets", data);
    return response.data.data;
  },

  /**
   * Update an existing wallet
   */
  update: async (id, data) => {
    const response = await api.patch(`/wallets/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a wallet
   */
  delete: async (id) => {
    const response = await api.delete(`/wallets/${id}`);
    return response.data.data;
  },
};
