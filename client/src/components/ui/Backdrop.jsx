import { useEffect } from "react";
import { motion as Motion } from "motion/react";

const Backdrop = ({ className = "", blur = false, onClose }) => {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <Motion.div
      className={`fixed inset-0 z-40 ${blur ? "bg-black/40 backdrop-blur-xs dark:backdrop-blur-sm" : "backdrop-brightness-75 dark:backdrop-brightness-50"} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      aria-hidden="true"
    ></Motion.div>
  );
};

export default Backdrop;
