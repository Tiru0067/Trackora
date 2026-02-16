import { Moon, Sun } from "lucide-react";
import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";
import {
  motion as Motion,
  AnimatePresence,
  useReducedMotion,
} from "motion/react";

const ThemeToggle = ({ buttonStyle }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.25 };

  return (
    <div>
      <button
        type="button"
        className={`${buttonStyle} relative`}
        onClick={toggleTheme}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <Motion.div
              key="dark"
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
              transition={transition}
            >
              <Moon size={18} />
            </Motion.div>
          ) : (
            <Motion.div
              key="light"
              initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={transition}
            >
              <Sun size={18} />
            </Motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default ThemeToggle;
