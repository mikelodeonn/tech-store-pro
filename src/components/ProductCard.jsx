import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
export default function ProductCard({ product }) {
  

  const { addItem } = useCart();
  return (
    <article className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="price">${product.price}</p>
      <p className="rating">★ {product.rating}</p>
      <Link to={`/productos/${product.id}`}>Ver detalle</Link>
      <button onClick={() => addItem(product)}>Agregar al carrito</button>
    </article>
  );
}
