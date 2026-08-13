import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import FormField from "@/components/ui/FormField";
import SymbolPicker from "@/components/ui/SymbolPicker";
import ColorPicker from "@/components/ui/ColorPicker";
import { useCategories } from "../hooks/useCategories";

const CategoryFormModal = ({ isOpen, onClose, category = null }) => {
  const { createCategory, updateCategory } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    color: "#3B82F6",
    icon: { set: "phosphor", name: "Tag" },
    note: "",
  });

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("");
    }

    if (category && isOpen) {
      setFormData({
        name: category.name,
        color: category.color,
        icon:
          category.icon.type === "icon"
            ? { set: category.icon.pack, name: category.icon.value }
            : { set: "emojis", name: category.icon.value },
        note: category.note || "",
      });
    } else if (isOpen) {
      setFormData({
        name: "",
        color: "#3B82F6",
        icon: { set: "phosphor", name: "Tag" },
        note: "",
      });
    }
  }, [category, isOpen]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        color: formData.color,
        icon:
          formData.icon.set === "phosphor"
            ? { type: "icon", value: formData.icon.name, pack: "phosphor" }
            : { type: "emoji", value: formData.icon.name },
        note: formData.note || undefined,
      };

      if (category) {
        await updateCategory(category.id, payload);
      } else {
        await createCategory(payload);
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? "Edit Category" : "Create New Category"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">
            {error}
          </div>
        )}

        {/* Category Name & Pickers */}
        <FormField label="Name" id="categoryName">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex form-input focus-within:ring-1 focus-within:ring-(--accent) p-0 bg-transparent border border-(--line) rounded-lg flex-1 overflow-hidden">
                <SymbolPicker
                  value={formData.icon}
                  onChange={(icon) =>
                    setFormData((prev) => ({ ...prev, icon }))
                  }
                  color={formData.color}
                  showLabel={false}
                  className="w-10 h-10 shrink-0 p-0 flex items-center justify-center rounded-none border-r border-(--line-soft)"
                />
                <input
                  type="text"
                  id="categoryName"
                  name="name"
                  placeholder="Category name"
                  className="outline-none flex-1 bg-transparent px-3 text-(--ink)"
                  maxLength={32}
                  autoComplete="off"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <ColorPicker
                value={formData.color}
                onChange={(color) =>
                  setFormData((prev) => ({ ...prev, color }))
                }
                className="shrink-0 w-10 h-10 p-0 flex items-center justify-center border border-(--line) rounded-lg"
                placement="bottom-end"
              />
            </div>
            <p className="text-xs text-(--ink-muted) mt-1">
              Set a name, icon, and accent color for your category
            </p>
          </div>
        </FormField>

        {/* Note */}
        <FormField label="Note (Optional)" id="categoryNote">
          <input
            type="text"
            id="categoryNote"
            name="note"
            placeholder="e.g. Groceries, Rent, Salary"
            className="form-input focus:ring-1 focus:ring-(--accent) bg-transparent border border-(--line) rounded-lg w-full px-3 h-10 outline-none text-(--ink)"
            value={formData.note}
            onChange={handleChange}
          />
        </FormField>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4 border-t border-(--line-soft) pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-(--ink-soft) hover:text-(--ink) transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-(--accent) rounded-full hover:bg-(--accent)/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? "Saving..."
              : category
                ? "Update Category"
                : "Add Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
