
import { useEffect, useState } from "react";
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
        if (err.status === 401 || err.status === 403) logout(); // sesión vencida
        else setError(err.message);
      });
  }, [token]);

  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Cargando...</p>;

  return (
    <section>
      <h1>Mi cuenta</h1>
      <img src={user.image} alt={user.username} width="96" />
      <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Usuario:</strong> {user.username}</p>
      <p><strong>Correo:</strong> {user.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </section>
  );
}