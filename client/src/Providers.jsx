import { ThemeProvider } from "@/context/ThemeContext";

const Providers = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default Providers;
