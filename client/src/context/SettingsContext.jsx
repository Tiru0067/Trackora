import { createContext, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    salaryDay: 1, // Default salary day of the month, shoudn't be 0, it should be 1-31
  });

  const updateSalaryDay = (day) => {
    if (day < 1 || day > 31) {
      console.error("Salary day must be between 1 and 31");
      return;
    }
    setSettings((prev) => ({ ...prev, salaryDay: day }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSalaryDay }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
