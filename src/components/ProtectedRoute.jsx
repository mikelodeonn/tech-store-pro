
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  // Obtiene el estado de autenticación del contexto y la ubicación actual de la ruta. Si el usuario no está autenticado,
  // redirige a la página de inicio de sesión y guarda la ubicación actual en el estado para poder redirigir después de 
  // iniciar sesión
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
