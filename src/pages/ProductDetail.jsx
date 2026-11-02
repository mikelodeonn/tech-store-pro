import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return null;

  return (
    <section className="product-detail">
      <Link to="/productos">← Volver</Link>
      <div className="detail-layout">
        <img src={product.images[0] ?? product.thumbnail} alt={product.title} />
        <div>
          <h1>{product.title}</h1>
          <p>{product.brand} · {product.category}</p>
          <p className="price">${product.price}</p>
          <p>★ {product.rating} · Stock: {product.stock}</p>
          <p>{product.description}</p>
        </div>
      </div>
      <button onClick={() => addItem(product)}>Agregar al carrito</button>
    </section>
  );
}