import { Link, Navigate, useLocation } from "react-router-dom";
import { formatPrice } from "../utils/format";

export default function OrderConfirmation() {
  const { state } = useLocation();
  const order = state?.order;

  // Si alguien entra directo a /confirmacion, no hay pedido que mostrar
  if (!order) return <Navigate to="/" replace />;

  return (
    <section className="confirmation">
      <h1>¡Gracias por tu compra!</h1>
      <p>
        Pedido <strong>{order.id}</strong> ·{" "}
        {new Date(order.date).toLocaleString("es-MX")}
      </p>

      <h2>Envío</h2>
      <p>{order.customer.fullName}</p>
      <p>{order.customer.address}, {order.customer.city}, CP {order.customer.zip}</p>
      <p>{order.customer.email} · {order.customer.phone}</p>

      <h2>Pago</h2>
      <p>{order.paymentMethod}</p>

      <h2>Productos</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.title} × {item.quantity} — {formatPrice(item.price * item.quantity)}
          </li>
        ))}
      </ul>

      <p className="cart-total">Total: <strong>{formatPrice(order.total)}</strong></p>

      <Link to="/productos">Seguir comprando</Link>
    </section>
  );
}