import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loginUser, registerUser, logoutUser } from "@/features/auth/api/auth";
import { getUser } from "@/api/user";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = useCallback(
    async ({ name, email, currency: baseCurrency, password }) => {
      const { data } = await registerUser({
        name,
        email,
        baseCurrency,
        password,
      });

      return data;
    },
    [],
  );

  const login = useCallback(async ({ email, password }) => {
    const { data } = await loginUser({ email, password });
    if (data) {
      setUser(data.data);
    } else {
      setUser({ email });
    }

    return data;
  }, []);

  const logout = useCallback(async () => {
    const { data } = await logoutUser();
    setUser(null);
    return data;
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const { data } = await getUser();
      setUser(data.data);
      return data;
    } catch (error) {
      console.error(error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUser().catch(() => console.error);
  }, [loadUser]);

  const value = useMemo(() => {
    return {
      user,
      loading,
      register,
      login,
      logout,
      loadUser,
    };
  }, [user, loading, register, login, logout, loadUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
