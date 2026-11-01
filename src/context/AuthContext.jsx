// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { loginRequest } from "../services/authService";

const STORAGE_KEY = "session";
const AuthContext = createContext(null);

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  async function login(username, password) {
    const data = await loginRequest(username, password);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}