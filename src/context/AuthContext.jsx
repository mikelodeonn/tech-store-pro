
import { createContext, useContext, useState } from "react";
import { loginRequest } from "../services/authService";

// Contexto de auutenticacion que sua una clave para guardar y leer en localStorage; y un contenedor global 
// que provee el contexto a los componentes hijos. El contexto contiene la información del usuario, el token 
// de autenticación y funciones para iniciar y cerrar sesión.
const STORAGE_KEY = "session";
const AuthContext = createContext(null);

// Función que carga la sesión desde el localStorage y la devuelve como un objeto. Si no hay sesión, devuelve null.
function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

// Componente que provee el contexto de autenticación a los componentes hijos. Mantiene el estado de la sesión y
// define las funciones para iniciar y cerrar sesión. Al iniciar sesión, guarda la sesión en el localStorage y
// actualiza el estado. Al cerrar sesión, elimina la sesión del localStorage y actualiza el estado. 
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

  // Valor del contexto que se provee a los componentes hijos. Contiene la información del usuario, el token de 
  // autenticación, un booleano que indica si el usuario está autenticado y las funciones para iniciar y cerrar sesión.
  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook que permite acceder al contexto de autenticación desde cualquier componente hijo. Lanza un error si se intenta usar
//  fuera del proveedor de contexto.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}