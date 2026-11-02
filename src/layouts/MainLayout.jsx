import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Componente que representa el diseño principal de la aplicación. 
export default function MainLayout() {
  // Obtiene el estado de autenticación y la función de cierre de sesión del contexto de autenticación, así como 
  // el número total de artículos en el carrito del contexto del carrito. Renderiza los enlaces de navegación 
  // según el estado de autenticación y muestra el número total de artículos en el carrito.
  const { isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  return (
    <>
      {isAuthenticated ? (
        <>
          <NavLink to="/mi-cuenta">Mi cuenta</NavLink>
          <button onClick={logout}>Salir</button>
        </>
      ) : (
        <NavLink to="/login">Iniciar sesión</NavLink>
      )}
      <header>
        <nav>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/productos">Productos</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <NavLink to="/carrito">Carrito ({totalItems})</NavLink>
      <footer>© TechStore</footer>
    </>
  );
}
