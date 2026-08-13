import { createContext, useState, useEffect, useCallback } from "react";
import { categoriesApi } from "../api/categories";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      addToast("Failed to load categories", "error");
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, [user, addToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = async (data) => {
    try {
      const newCategory = await categoriesApi.create(data);
      setCategories((prev) => [...prev, newCategory]);
      addToast("Category created successfully");
      return newCategory;
    } catch (err) {
      console.error("Failed to create category:", err);
      addToast("Failed to create category", "error");
      throw err;
    }
  };

  const updateCategory = async (id, data) => {
    try {
      const updatedCategory = await categoriesApi.update(id, data);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updatedCategory : c)),
      );
      addToast("Category updated successfully");
      return updatedCategory;
    } catch (err) {
      console.error("Failed to update category:", err);
      addToast("Failed to update category", "error");
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoriesApi.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      addToast("Category deleted successfully");
    } catch (err) {
      console.error("Failed to delete category:", err);
      addToast("Failed to delete category", "error");
      throw err;
    }
  };

  const orderedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <CategoryContext.Provider
      value={{
        categories: orderedCategories,
        isLoading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
