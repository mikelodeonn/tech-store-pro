// src/pages/Login.jsx
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/mi-cuenta";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
        console.error("Login falló:", err.status, err.message);
      setError(
        err.status === 400
          ? "Usuario o contraseña incorrectos."
          : "No se pudo conectar. Intenta de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
        {error && <p role="alert" className="error">{error}</p>}
      </form>
    </section>
  );
}