import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' })

export default function CartPage() {
  const cart = useCart()
  const navigate = useNavigate()
  return <div className="storefront"><header className="site-header"><Link className="brand" to="/"><span className="brand-mark">T</span> tech<span>store</span></Link><Link className="cart-link" to="/">Seguir comprando <span>→</span></Link></header>
    <main className="commerce-page"><nav className="breadcrumbs"><Link to="/">Inicio</Link><span>/</span><span>Carrito</span></nav><h1>Tu carrito</h1>
      {!cart.items.length ? <section className="empty-cart"><p>Tu carrito está vacío.</p><Link className="primary-button" to="/">Explorar productos <span>→</span></Link></section> : <div className="cart-layout"><section className="cart-items" aria-label="Productos en el carrito">
        {cart.items.map((item) => <article className="cart-row" key={item.id}><img src={item.imagen} alt=""/><div className="cart-item-info"><h2>{item.nombre}</h2><p>{money.format(item.precio)} por unidad</p><div className="quantity-control"><button type="button" onClick={() => cart.cambiarCantidad(item.id, -1)} aria-label={`Disminuir cantidad de ${item.nombre}`}>−</button><span>{item.cantidad}</span><button type="button" onClick={() => cart.cambiarCantidad(item.id, 1)} aria-label={`Aumentar cantidad de ${item.nombre}`}>+</button></div></div><strong>{money.format(item.precio * item.cantidad)}</strong><button className="remove-item" type="button" onClick={() => cart.quitar(item.id)}>Eliminar</button></article>)}
        <button className="clear-cart" type="button" onClick={cart.vaciar}>Vaciar carrito</button></section><aside className="order-summary"><h2>Resumen</h2><div><span>Subtotal</span><strong>{money.format(cart.subtotal)}</strong></div><div><span>Envío</span><span>Gratis</span></div><div className="summary-total"><span>Total</span><strong>{money.format(cart.subtotal)}</strong></div><button className="checkout-button" type="button" onClick={() => navigate('/checkout')}>Continuar al checkout</button></aside></div>}
    </main><footer className="site-footer"><Link className="brand" to="/"><span className="brand-mark">T</span> tech<span>store</span></Link><span>Tu próximo gadget está aquí.</span></footer></div>
}
