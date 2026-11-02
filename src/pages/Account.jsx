import { useEffect, useState } from "react";
import { LogOut, Mail, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../services/authService";

export default function Account() {
  // Obtiene el token y la información del usuario del contexto de autenticación, así como la función de cierre de sesión. 
  // Mantiene el estado del usuario y el error. Al montar el componente, llama a la función para obtener la información del 
  // usuario actual con el token. Si tiene éxito, actualiza el estado del usuario; si falla, muestra un mensaje de error o 
  // cierra sesión si la sesión ha vencido.
  const { token, user: cachedUser, logout } = useAuth();
  const [user, setUser] = useState(cachedUser);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentUser(token)
      .then(setUser)
      .catch((err) => {
        if (err.status === 401 || err.status === 403) logout();
        else setError(err.message);
      });
  }, [token]);

  if (error) return <p className="notice notice--error">No pudimos cargar tu cuenta: {error}</p>;
  if (!user) return <p className="notice">Cargando tu cuenta…</p>;

  return (
    <section className="account-card">
      <header className="account-card__header">
        <p className="eyebrow">Tu espacio TechStore Pro</p>
        <h1>Mi cuenta<span>.</span></h1>
      </header>
      <div className="account-card__body">
        <div className="account-profile">
          <img src={user.image} alt={user.username} />
          <div>
            <h2>{user.firstName} {user.lastName}</h2>
            <p>@{user.username}</p>
          </div>
        </div>
        <dl className="account-details">
          <div className="account-detail">
            <span className="account-detail__icon"><UserRound size={18} /></span>
            <div><dt>Usuario</dt><dd>{user.username}</dd></div>
          </div>
          <div className="account-detail">
            <span className="account-detail__icon"><Mail size={18} /></span>
            <div><dt>Correo</dt><dd>{user.email}</dd></div>
          </div>
        </dl>
        <button onClick={logout} className="button button--outline account-logout"><LogOut size={16} /> Cerrar sesión</button>
      </div>
    </section>
  );
}
