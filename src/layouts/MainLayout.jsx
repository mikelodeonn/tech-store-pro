import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ArrowUpRight, ShoppingBag, UserRound } from "lucide-react";

function SiteNavLink({ to, end, children, mobile = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `site-nav__link${mobile ? " site-nav__link--mobile" : ""}${isActive ? " is-active" : ""}`
      }
    >
      {children}
    </NavLink>
  );
}

// Componente que representa el diseño principal de la aplicación. 
export default function MainLayout() {
  // Obtiene el estado de autenticación y la función de cierre de sesión del contexto de autenticación, así como 
  // el número total de artículos en el carrito del contexto del carrito. Renderiza los enlaces de navegación 
  // según el estado de autenticación y muestra el número total de artículos en el carrito.
  const { isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div id="top" className="site-shell">
      <div className="announcement">
        ENVÍO GRATIS EN PEDIDOS SELECCIONADOS <span>✳</span> TECNOLOGÍA QUE TE SIGUE EL RITMO
      </div>
      <header className="site-header">
        <div className="site-header__inner">
          <NavLink to="/" className="brand" aria-label="TechStore Pro, inicio">
            <span className="brand__mark">TS</span>
            <span className="brand__name">TechStore <span>Pro</span></span>
          </NavLink>

          <nav className="site-nav site-nav--desktop" aria-label="Navegación principal">
            <SiteNavLink to="/" end>Inicio</SiteNavLink>
            <SiteNavLink to="/productos">Productos</SiteNavLink>
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <NavLink to="/mi-cuenta" className="header-action header-action--account">
                  <UserRound size={17} /> Mi cuenta
                </NavLink>
                <button onClick={logout} className="header-action header-action--logout">Salir</button>
              </>
            ) : (
              <NavLink to="/login" className="header-action header-action--account">
                <UserRound size={17} /> Entrar
              </NavLink>
            )}
            <NavLink to="/carrito" className="cart-link">
              <ShoppingBag size={17} strokeWidth={2.3} />
              <span className="cart-link__label">Carrito</span>
              <span className="cart-link__count">{totalItems}</span>
            </NavLink>
          </div>
        </div>
        <nav className="site-nav site-nav--mobile" aria-label="Navegación móvil">
          <SiteNavLink to="/" end mobile>Inicio</SiteNavLink>
          <SiteNavLink to="/productos" mobile>Productos</SiteNavLink>
          {isAuthenticated ? (
            <SiteNavLink to="/mi-cuenta" mobile>Mi cuenta</SiteNavLink>
          ) : (
            <SiteNavLink to="/login" mobile>Entrar</SiteNavLink>
          )}
        </nav>
      </header>

      <main className="site-main"><Outlet /></main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="footer-brand"><span className="brand__mark">TS</span><span>TechStore Pro</span></div>
          <p className="site-footer__copy">Tecnología para lo que sigue. © {new Date().getFullYear()} TechStore Pro.</p>
          <a href="#top" className="footer-top-link">Volver arriba <ArrowUpRight size={16} /></a>
        </div>
      </footer>
    </div>
  );
}
