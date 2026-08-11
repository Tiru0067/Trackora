import { motion } from "motion/react";
import { cn } from "@/utils/cn";

function LoadingThreeDots({ fullScreen = true, className }) {
  const dotVariants = {
    jump: {
      transform: fullScreen ? "translateY(-24px)" : "translateY(-12px)",
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className={cn(
        "flex items-center justify-center gap-2",
        fullScreen ? "w-screen h-dvh" : "w-full p-12",
        className
      )}
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full bg-(--accent) will-change-transform",
            fullScreen ? "h-4 w-4" : "h-2.5 w-2.5"
          )}
          variants={dotVariants}
        />
      ))}
    </motion.div>
  );
}

export default LoadingThreeDots;
