import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, PackageCheck, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { getStockStatus } from "../utils/stock";
import { getFinalPrice, getDiscountLabel, hasDiscount } from "../utils/pricing";
import ProductReviews from "../components/ProductReviews";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { items, addItem } = useCart();

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

  const inCart = items.find((i) => i.id === product.id)?.quantity ?? 0;
  const stockStatus = getStockStatus(product.stock);
  const isOut = stockStatus.key === "out";
  const maxReached = !isOut && inCart >= product.stock;

  const buttonLabel = isOut
    ? "No disponible"
    : maxReached
    ? "Máximo en carrito"
    : "Agregar al carrito";

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
            <span>{isOut ? "Agotado" : "Disponible"}</span>
          </div>
          <div className="price-block price-block--detail">
            <p className="product-detail__price">{formatPrice(getFinalPrice(product))}</p>
            {hasDiscount(product) && (
              <>
                <span className="price-original">{formatPrice(product.price)}</span>
                <span className="discount-badge">{getDiscountLabel(product)}</span>
              </>
            )}
          </div>
          <p className="product-detail__description">{product.description}</p>

          <button
            onClick={() => addItem(product)}
            disabled={isOut || maxReached}
            className="button button--primary product-detail__add"
          >
            <ShoppingBag size={18} /> {buttonLabel}
          </button>

          {isOut && <p className="stock-out">Este producto no está disponible por ahora.</p>}
          {!isOut && stockStatus.key === "low" && (
            <p className="stock-low">{stockStatus.label}</p>
          )}
          {maxReached && (
            <p className="stock-low">Ya tienes todas las unidades disponibles en tu carrito.</p>
          )}

          <div className="product-detail__benefits">
            <div><PackageCheck size={19} /><span>Envío a todo México</span></div>
            <div><ShieldCheck size={19} /><span>Compra segura</span></div>
          </div>
          <p className="product-detail__note"><Check size={15} /> Selección TechStore: tecnología pensada para durar.</p>
        </div>
      </div>
      <ProductReviews reviews={product.reviews} />
    </section>
  );
}
