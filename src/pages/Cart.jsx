import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

// Componente que representa la página del carrito de compras. Muestra los artículos en el carrito, permite 
// aumentar o disminuir la cantidad de cada artículo, eliminar artículos individuales o vaciar el carrito por 
// completo. También muestra el total del carrito y un enlace para ir al catálogo de productos si el carrito está vacío.
export default function Cart() {
  const { items, total, totalItems, increase, decrease, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="cart-empty">
        <div className="cart-empty__icon"><ShoppingBag size={30} /></div>
        <p className="eyebrow">Tu carrito te espera</p>
        <h1 className="page-title">Todavía está vacío<span>.</span></h1>
        <p className="cart-empty__copy">Hay tecnología increíble por descubrir. Encuentra algo que vaya contigo.</p>
        <Link to="/productos" className="button button--primary">Explorar productos <ArrowRight size={17} /></Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <Link to="/productos" className="back-link"><ArrowLeft size={16} /> Seguir explorando</Link>
      <div className="cart-heading">
        <div><p className="eyebrow">Casi tuyo</p><h1 className="page-title">Tu carrito<span>.</span></h1></div>
        <span className="cart-heading__count">{totalItems} {totalItems === 1 ? "artículo" : "artículos"}</span>
      </div>

      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((item) => (
            console.log(item.title, "qty:", item.quantity, "stock:", item.stock),
            <li key={item.id} className="cart-item">
              <Link to={`/productos/${item.id}`} className="cart-item__image-link">
                <img src={item.thumbnail} alt={item.title} />
              </Link>
              <div className="cart-item__description">
                <Link to={`/productos/${item.id}`} className="cart-item__title">{item.title}</Link>
                <p>{formatPrice(item.price)} c/u</p>
              </div>  
              <div className="quantity-control">
                <button onClick={() => decrease(item.id)} disabled={item.quantity === 1} aria-label="Disminuir cantidad"><Minus size={14} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => increase(item.id)} disabled={item.quantity >= item.stock} aria-label="Aumentar cantidad"><Plus size={14} /></button>
              </div>
              <p className="cart-item__total">{formatPrice(item.price * item.quantity)}</p>
              <button onClick={() => removeItem(item.id)} aria-label={`Eliminar ${item.title}`} className="remove-item"><Trash2 size={16} /></button>
            </li>
          ))}
        </ul>
        <aside className="cart-summary">
          <p className="cart-summary__eyebrow">Resumen</p>
          <div className="cart-summary__line"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
          <div className="cart-summary__line"><span>Envío</span><span className="cart-summary__shipping">Se calcula al finalizar</span></div>
          <div className="cart-summary__divider" />
          <div className="cart-summary__total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          <button className="button button--primary cart-summary__checkout">Continuar compra <ArrowRight size={16} /></button>
          <p className="cart-summary__security"><ShieldCheck size={15} /> Tus datos están protegidos</p>
          <button onClick={clearCart} className="cart-summary__clear">Vaciar carrito</button>
        </aside>
      </div>

    </section>
  );
}
