import { Outlet, NavLink } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
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

