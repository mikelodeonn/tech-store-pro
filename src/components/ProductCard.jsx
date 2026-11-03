import { Link } from "react-router-dom";
import { ArrowUpRight, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { getStockStatus } from "../utils/stock";
import { getFinalPrice, getDiscountLabel, hasDiscount } from "../utils/pricing";

export default function ProductCard({ product }) {
  const { items, addItem } = useCart();

  const stockStatus = getStockStatus(product.stock);
  const isOut = stockStatus.key === "out";
  const inCart = items.find((i) => i.id === product.id)?.quantity ?? 0;
  const maxReached = inCart >= product.stock;

  const buttonLabel = isOut
    ? "No disponible"
    : maxReached
    ? "Máximo en carrito"
    : "Agregar al carrito";

  return (
    <article className="product-card">
      <Link
        to={`/productos/${product.id}`}
        className="product-card__image-link"
        aria-label={`Ver ${product.title}`}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-card__image"
        />
        <span className="product-card__quick-view">
          <ArrowUpRight size={17} />
        </span>
      </Link>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="product-card__brand">
            {product.brand || product.category}
          </span>
          <span className="product-rating">
            <Star size={13} /> {product.rating}
          </span>
        </div>

        <Link to={`/productos/${product.id}`} className="product-card__title">
          {product.title}
        </Link>

        <div className="product-card__purchase-row">
          <div className="price-block price-block--card">
            <p className="product-card__price">{formatPrice(getFinalPrice(product))}</p>
            {hasDiscount(product) && (
              <>
                <span className="price-original">{formatPrice(product.price)}</span>
                <span className="discount-badge">{getDiscountLabel(product)}</span>
              </>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            disabled={isOut || maxReached}
            aria-label={`${buttonLabel}: ${product.title}`}
            title={buttonLabel}
            className="icon-button icon-button--primary"
          >
            <ShoppingBag size={17} />
          </button>
        </div>

        {stockStatus.key !== "ok" && (
          <p className={`stock-badge stock-${stockStatus.key}`}>
            {stockStatus.label}
          </p>
        )}
        {maxReached && !isOut && (
          <p className="stock-badge stock-low">Máximo en carrito</p>
        )}
      </div>
    </article>
  );
}
