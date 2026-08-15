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
  const [isOffline, setIsOffline] = useState(false);

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
      setLoading(false);
      setIsOffline(false);
      return data;
    } catch (error) {
      console.error("Auth load error:", error.message);
      // Only clear the user if the token is actually invalid (401 or 403)
      // If it's a network error or 500 server error, show offline screen
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
        setLoading(false);
      } else {
        setIsOffline(true);
        setLoading(false);
      }
    }
  }, []);

  const retryConnection = useCallback(() => {
    setIsOffline(false);
    setLoading(true);
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUser();
  }, [loadUser]);

  const value = useMemo(() => {
    return {
      user,
      loading,
      isOffline,
      register,
      login,
      logout,
      loadUser,
      retryConnection,
    };
  }, [user, loading, isOffline, register, login, logout, loadUser, retryConnection]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
