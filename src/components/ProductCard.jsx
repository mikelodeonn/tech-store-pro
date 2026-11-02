import { Link } from "react-router-dom";
import { ArrowUpRight, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="product-card">
      <Link to={`/productos/${product.id}`} className="product-card__image-link" aria-label={`Ver ${product.title}`}>
        <img src={product.thumbnail} alt={product.title} className="product-card__image" />
        <span className="product-card__quick-view"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="product-card__brand">{product.brand || product.category}</span>
          <span className="product-rating"><Star size={13} /> {product.rating}</span>
        </div>
        <Link to={`/productos/${product.id}`} className="product-card__title">{product.title}</Link>
        <div className="product-card__purchase-row">
          <p className="product-card__price">{formatPrice(product.price)}</p>
          <button onClick={() => addItem(product)} aria-label={`Agregar ${product.title} al carrito`} className="icon-button icon-button--primary">
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
