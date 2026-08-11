import api from "@/api/axios";

export const categoriesApi = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/categories", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data.data;
  },
};
