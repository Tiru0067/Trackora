import { use } from "react";
import ThemeContext from "@/context/ThemeContext";

const useTheme = () => use(ThemeContext);

export default useTheme;
