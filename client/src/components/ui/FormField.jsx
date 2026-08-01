import { cn } from "@/utils/cn";

const FormField = ({
  label,
  id,
  className = "w-full",
  labelClassName,
  srOnlyLabel = false,
  children,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <label
        htmlFor={id}
        className={cn(
          "block text-sm font-medium text-(--ink-soft) mb-1",
          srOnlyLabel && "sr-only",
          labelClassName,
        )}
      >
        {label}
      </label>

      {children}
    </div>
  );
};

export default FormField;
