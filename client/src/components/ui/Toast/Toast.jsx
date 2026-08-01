import { CheckCircle2, XCircle, TriangleAlert, Info, X } from "lucide-react";
import { motion as Motion } from "motion/react";
import { cn } from "@/utils/cn";

const DURATION = 3500;
const RING_CIRCUMFERENCE = 62.8;

const ProgressRing = ({ duration, onComplete }) => (
  <svg
    aria-hidden="true"
    width="28"
    height="28"
    style={{ transform: "rotate(-90deg)" }}
  >
    <circle
      cx="14"
      cy="14"
      r="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.2"
    />

    <Motion.circle
      cx="14"
      cy="14"
      r="10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray={RING_CIRCUMFERENCE}
      initial={{ strokeDashoffset: 0 }}
      animate={{ strokeDashoffset: RING_CIRCUMFERENCE }}
      transition={{ duration: duration / 1000, ease: "linear" }}
      onAnimationComplete={onComplete}
    />
  </svg>
);

const types = {
  success: {
    icon: (
      <CheckCircle2 aria-hidden="true" className="size-5 stroke-green-500" />
    ),
    className: "border-green-500/30 bg-green-100 dark:bg-green-950",
  },
  error: {
    icon: <XCircle aria-hidden="true" className="size-5 stroke-red-500" />,
    className: "border-red-500/30 bg-red-100 dark:bg-red-950",
  },
  warning: {
    icon: (
      <TriangleAlert aria-hidden="true" className="size-5 stroke-yellow-500" />
    ),
    className: "border-yellow-500/30 bg-yellow-100 dark:bg-yellow-950",
  },
  info: {
    icon: <Info aria-hidden="true" className="size-5 stroke-blue-500" />,
    className: "border-blue-500/30 bg-blue-100 dark:bg-blue-950",
  },
};

const Toast = ({ toast, onRemove }) => {
  const config = types[toast.type] ?? types.info;

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className={cn(
        "flex items-center gap-3 px-4 py-3 min-w-72 max-w-sm card",
        config.className,
      )}
    >
      {config.icon}

      <p className="text-sm flex-1 text-(--ink)">{toast.message}</p>

      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        aria-label="Dismiss notification"
        className="relative flex items-center justify-center"
      >
        <ProgressRing
          duration={DURATION}
          onComplete={() => onRemove(toast.id)}
        />

        <X aria-hidden="true" className="size-3 absolute stroke-(--ink)" />
      </button>
    </div>
  );
};

export default Toast;
