import { useState, useEffect } from "react";
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
    <section>
      <h1>Bienvenido a Mi Tienda</h1>
      <h2>Productos destacados</h2>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
