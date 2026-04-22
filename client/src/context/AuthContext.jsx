import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("lumora.user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("lumora.token"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("lumora.token")));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("lumora.user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("lumora.token");
        localStorage.removeItem("lumora.user");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("lumora.token", data.token);
    localStorage.setItem("lumora.user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  async function register(payload) {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("lumora.token", data.token);
    localStorage.setItem("lumora.user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  async function forgotPassword(email) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  }

  async function resetPassword(payload) {
    const { data } = await api.post("/auth/reset-password", payload);
    return data;
  }

  function logout() {
    localStorage.removeItem("lumora.token");
    localStorage.removeItem("lumora.user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, token, loading, login, register, forgotPassword, resetPassword, logout }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
