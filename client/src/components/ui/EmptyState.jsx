import { Plus } from "lucide-react";
import { motion as Motion } from "motion/react";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-6 py-20 text-center col-span-full w-full"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-(--accent)/10 flex items-center justify-center border border-(--accent)/20 shadow-sm">
          <Icon aria-hidden="true" size={36} className="text-(--accent)" />
        </div>
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-(--accent)/50 ring-4 ring-(--bg-card) animate-pulse"
        />
      </div>

      <div className="flex flex-col gap-2 max-w-70">
        <h3 className="text-lg font-semibold text-(--ink)">{title}</h3>
        <p className="text-sm text-(--ink-soft) leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm bg-(--ink)/90 text-(--bg) rounded-xl font-medium hover:bg-(--ink)/80 transition-colors shadow-sm mt-2"
        >
          <Plus aria-hidden="true" size={16} strokeWidth={2} />
          <span>{actionLabel}</span>
        </button>
      )}
    </Motion.div>
  );
};

export default EmptyState;
