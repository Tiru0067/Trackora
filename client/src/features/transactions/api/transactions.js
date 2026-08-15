import api from "@/api/axios";

export const transactionsApi = {
  /**
   * Fetch paginated transactions with optional filters
   * @param {Object} filters - Query parameters (walletId, limit, page, etc.)
   */
  getAll: async (filters = {}) => {
    const response = await api.get("/transactions", { params: filters });
    // Note: The backend returns { data: [...], pagination: {...} }
    return response.data;
  },

  /**
   * Fetch a single transaction by ID
   */
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  /**
   * Create a new transaction
   */
  create: async (data) => {
    const response = await api.post("/transactions", data);
    return response.data.data;
  },

  /**
   * Update an existing transaction
   */
  update: async (id, data) => {
    const response = await api.patch(`/transactions/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a transaction
   */
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data.data;
  },
};
