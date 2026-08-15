import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.seedAdmin();
    const current = authService.getCurrentUser();
    if (current) setUser(current);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const loggedIn = await authService.login(credentials);
    setUser(loggedIn);
    return loggedIn;
  };

  const signup = async (data) => {
    const created = await authService.signup(data);
    setUser(created);
    return created;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updates) => {
    const next = { ...user, ...updates };
    setUser(next);
    localStorage.setItem("driveeasy_current_user", JSON.stringify(next));
    const users = JSON.parse(localStorage.getItem("driveeasy_users") || "[]");
    const idx = users.findIndex((u) => u.id === next.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem("driveeasy_users", JSON.stringify(users));
    }
  };

  const isAdmin = user?.role === "admin";

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
