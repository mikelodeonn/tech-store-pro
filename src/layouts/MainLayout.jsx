import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { isAuthenticated, logout } = useAuth();
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
      <footer>© TechStore</footer>
    </>
  );
}
