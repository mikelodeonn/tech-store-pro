import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { getfeaturedProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getfeaturedProducts(8)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__orbit" />
        <div className="home-hero__glow" />
        <div className="home-hero__content">
          <div className="home-hero__copy">
            <span className="home-hero__eyebrow"><Sparkles size={14} /> Tu siguiente upgrade empieza aquí</span>
            <h1 className="home-hero__title">Tecnología<br />que <span>va contigo.</span></h1>
            <p className="home-hero__description">Encuentra ese dispositivo que hace que cada día funcione mejor.</p>
            <div className="home-hero__actions">
              <Link to="/productos" className="button button--primary">Explorar productos <ArrowUpRight size={17} /></Link>
              <span className="home-hero__note">Selección curada · Novedades cada semana</span>
            </div>
          </div>
          <div className="home-hero__art" aria-hidden="true">
            <div className="home-hero__ring home-hero__ring--outer" />
            <div className="home-hero__ring home-hero__ring--inner" />
            <div className="home-hero__lime-orb" />
            <div className="home-hero__tile">
              <div className="home-hero__glyph">⌁</div>
              <span className="home-hero__float home-hero__float--top">ideas en movimiento</span>
              <span className="home-hero__float home-hero__float--bottom">TechStore Pro ↗</span>
            </div>
            <ArrowDownRight className="home-hero__arrow" size={38} strokeWidth={1.2} />
          </div>
        </div>
        <div className="home-hero__footnote"><span>Curiosidad, conectada.</span><span>01 / TECHSTORE PICKS</span></div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">La selección TechStore</p>
            <h2 className="section-heading__title">Favoritos para descubrir<span>.</span></h2>
          </div>
          <Link to="/productos" className="text-link">Ver todo <ArrowUpRight size={17} /></Link>
        </div>
        {loading && <p className="notice">Preparando la selección…</p>}
        {error && <p className="notice notice--error">No pudimos cargar los productos: {error}</p>}
        {!loading && !error && products.length === 0 && <p className="notice">Pronto habrá novedades.</p>}
        <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
    </div>
  );
}
