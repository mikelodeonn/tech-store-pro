import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="price">${product.price}</p>
      <p className="rating">★ {product.rating}</p>
      <Link to={`/productos/${product.id}`}>Ver detalle</Link>
    </article>
  );
}