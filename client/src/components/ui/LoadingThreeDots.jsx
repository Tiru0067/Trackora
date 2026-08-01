import { motion } from "motion/react";

function LoadingThreeDotsJumping() {
  const dotVariants = {
    jump: {
      transform: "translateY(-30px)",
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
      className="w-screen h-dvh flex items-center justify-center gap-2.5"
    >
      <motion.div
        className="h-5 w-5 rounded-full bg-indigo-500 will-change-transform"
        variants={dotVariants}
      />
      <motion.div
        className="h-5 w-5 rounded-full bg-indigo-500 will-change-transform"
        variants={dotVariants}
      />
      <motion.div
        className="h-5 w-5 rounded-full bg-indigo-500 will-change-transform"
        variants={dotVariants}
      />
    </motion.div>
  );
}

export default LoadingThreeDotsJumping;
