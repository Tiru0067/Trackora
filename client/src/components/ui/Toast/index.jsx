import Toast from "@/components/ui/Toast/Toast";

const ToastContainer = ({ toasts, onRemove }) => (
  <div
    aria-live="polite"
    aria-atomic="false"
    className="toast-container fixed top-4 z-50 flex flex-col gap-2
                left-1/2 -translate-x-1/2
                md:left-auto md:translate-x-0 md:right-4"
    onClick={(event) => event.stopPropagation()}
  >
    {toasts.map((toast) => (
      <Toast key={toast.id} toast={toast} onRemove={onRemove} />
    ))}
  </div>
);

export default ToastContainer;
