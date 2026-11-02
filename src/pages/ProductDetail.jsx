import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, PackageCheck, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

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

  if (loading) return <div className="notice">Cargando producto…</div>;
  if (error) return <div className="notice notice--error">No pudimos cargar el producto: {error}</div>;
  if (!product) return null;

  return (
    <section className="product-detail">
      <Link to="/productos" className="back-link"><ArrowLeft size={16} /> Volver al catálogo</Link>
      <div className="product-detail__layout">
        <div className="product-detail__image-wrap">
          <img src={product.images?.[0] ?? product.thumbnail} alt={product.title} />
        </div>
        <div className="product-detail__info">
          <div className="product-detail__meta">
            <span className="category-badge">{product.category}</span>
            {product.brand && <span className="product-detail__brand">{product.brand}</span>}
          </div>
          <h1 className="product-detail__title">{product.title}</h1>
          <div className="product-detail__rating">
            <span><Star size={15} /> {product.rating}</span>
            <span className="product-detail__separator">·</span>
            <span>{product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}</span>
          </div>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__description">{product.description}</p>
          <button onClick={() => addItem(product)} className="button button--primary product-detail__add">
            <ShoppingBag size={18} /> Agregar al carrito
          </button>
          <div className="product-detail__benefits">
            <div><PackageCheck size={19} /><span>Envío a todo México</span></div>
            <div><ShieldCheck size={19} /><span>Compra segura</span></div>
          </div>
          <p className="product-detail__note"><Check size={15} /> Selección TechStore: tecnología pensada para durar.</p>
        </div>
      </div>
    </section>
  );
}
