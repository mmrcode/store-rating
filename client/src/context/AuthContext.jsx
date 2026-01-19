import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (data) => {
    // data: name, email, password, address
    await api.post("/auth/signup", data);
    // Auto login or redirect? Requirement says "Normal users... sign up... log in".
    // So separate.
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updatePassword = async (password) => {
    await api.put("/users/password", { password });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updatePassword, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
