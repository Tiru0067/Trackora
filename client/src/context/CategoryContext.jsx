import { createContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Groceries", type: "expense", icon: "🛒" },
    { id: 2, name: "Food & Dining", type: "expense", icon: "🍔" },
    { id: 3, name: "Transport", type: "expense", icon: "🚗" },
    { id: 4, name: "Bills & Utilities", type: "expense", icon: "💡" },
    { id: 5, name: "Shopping", type: "expense", icon: "🛍️" },
    { id: 6, name: "Entertainment", type: "expense", icon: "🎬" },
    { id: 7, name: "Health", type: "expense", icon: "🏥" },
    { id: 8, name: "Education", type: "expense", icon: "📚" },

    { id: 9, name: "Salary", type: "income", icon: "💼" },
    { id: 10, name: "Freelance", type: "income", icon: "🧑‍💻" },
    { id: 11, name: "Business Income", type: "income", icon: "🏢" },
    { id: 12, name: "Investment", type: "income", icon: "📈" },
  ]);

  const addCategory = (category) => {
    setCategories((prev) => [...prev, category]);
  };

  const updateCategory = (id, updatedCategory) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedCategory } : cat)),
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <CategoryContext.Provider
      value={{ categories, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryContext;
