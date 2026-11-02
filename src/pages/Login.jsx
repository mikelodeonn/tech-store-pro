import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  // Obtiene las funciones de inicio de sesión y el estado de autenticación del contexto, así como las funciones de 
  // navegación y la ubicación actual de la ruta. Define el destino al que se redirigirá después de iniciar sesión,
  // que es la ruta desde la que se intentó acceder a la página protegida o la página de "mi-cuenta" por defecto.
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/mi-cuenta";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  // Función que maneja el envío del formulario de inicio de sesión. Evita el comportamiento por defecto del formulario,
  // limpia el error y establece el estado de envío. Llama a la función de inicio de sesión del contexto con el nombre de usuario y la contraseña, y redirige a la ruta de destino si tiene éxito. Si falla, muestra un mensaje de error
  // según el código de estado del error. Finalmente, restablece el estado de envío.
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login falló:", err.status, err.message);
      setError(err.status === 400 ? "Usuario o contraseña incorrectos." : "No se pudo conectar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="login-card">
      <div className="login-aside">
        <div className="login-aside__orbit" />
        <div className="login-aside__orb" />
        <span className="brand__mark login-aside__mark">n.</span>
        <div className="login-aside__message">
          <p className="eyebrow">Tu espacio TechStore Pro</p>
          <p className="login-aside__title">La tecnología<br />sigue contigo.</p>
          <p>Entra para continuar.</p>
        </div>
        <span className="login-aside__footer">TechStore Pro · tecnología para lo que sigue</span>
      </div>

      <div className="login-form-wrap">
        <p className="eyebrow">Qué bueno verte</p>
        <h1 className="login-form__title">Iniciar sesión<span>.</span></h1>
        <p className="login-form__intro">Ingresa tus datos para acceder a tu cuenta.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="form-field">
            <span>Usuario</span>
            <span className="form-field__control">
              <UserRound size={17} />
              <input autoComplete="username" placeholder="Tu usuario" value={username} onChange={(event) => setUsername(event.target.value)} required />
            </span>
          </label>
          <label className="form-field">
            <span>Contraseña</span>
            <span className="form-field__control">
              <LockKeyhole size={17} />
              <input type="password" autoComplete="current-password" placeholder="Tu contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </span>
          </label>
          {error && <p role="alert" className="notice notice--error">{error}</p>}
          <button disabled={submitting} className="button button--primary login-form__submit">
            {submitting ? "Entrando…" : <>Entrar a mi cuenta <ArrowRight size={17} /></>}
          </button>
        </form>
      </div>
    </section>
  );
}
