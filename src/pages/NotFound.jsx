import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__icon"><SearchX size={30} /></div>
      <p className="eyebrow">Error 404</p>
      <h1>Esta página se perdió<span>.</span></h1>
      <p className="not-found__copy">El enlace no existe o ya no está disponible.</p>
      <Link to="/" className="button button--primary"><ArrowLeft size={16} /> Volver al inicio</Link>
    </section>
  );
}
