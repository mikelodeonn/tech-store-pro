import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

// Componente que representa la página del carrito de compras. Muestra los artículos en el carrito, permite 
// aumentar o disminuir la cantidad de cada artículo, eliminar artículos individuales o vaciar el carrito por 
// completo. También muestra el total del carrito y un enlace para ir al catálogo de productos si el carrito está vacío.
export default function Cart() {
  const { items, total, totalItems, increase, decrease, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <h1>Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/productos">Ir al catálogo</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Carrito ({totalItems})</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <img src={item.thumbnail} alt={item.title} width="64" />
            <div>
              <Link to={`/productos/${item.id}`}>{item.title}</Link>
              <p>{formatPrice(item.price)} c/u</p>
            </div>

            <div className="quantity">
              <button onClick={() => decrease(item.id)} disabled={item.quantity === 1} aria-label="Disminuir">
                −
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => increase(item.id)} aria-label="Aumentar">
                +
              </button>
            </div>

            <p><strong>{formatPrice(item.price * item.quantity)}</strong></p>
            <button onClick={() => removeItem(item.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <p className="cart-total">Total: <strong>{formatPrice(total)}</strong></p>
      <Link to="/checkout">Proceder al pago</Link>
      <button onClick={clearCart}>Vaciar carrito</button>
    </section>
  );
}