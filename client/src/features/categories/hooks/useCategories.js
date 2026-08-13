import { use } from "react";
import CategoryContext from "../context/CategoryContext";

export const useCategories = () => {
  const context = use(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
