import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' })
const campos = [
  { name: 'nombre', label: 'Nombre completo', autoComplete: 'name', required: true, minLength: 3 },
  { name: 'correo', label: 'Correo electrónico', type: 'email', autoComplete: 'email', required: true },
  { name: 'telefono', label: 'Teléfono', type: 'tel', autoComplete: 'tel', required: true, pattern: '[0-9+() -]{10,}' },
  { name: 'direccion', label: 'Dirección', autoComplete: 'street-address', required: true, minLength: 5 },
  { name: 'ciudad', label: 'Ciudad', autoComplete: 'address-level2', required: true, minLength: 2 },
  { name: 'codigoPostal', label: 'Código postal', autoComplete: 'postal-code', required: true, pattern: '[0-9]{5}' },
]

export default function CheckoutPage() {
  const cart = useCart()
  const navigate = useNavigate()
  const [errores, setErrores] = useState({})
  const [confirmacion, setConfirmacion] = useState(false)

  function enviar(event) {
    event.preventDefault()
    const form = event.currentTarget
    const nuevosErrores = {}
    campos.forEach(({ name, label }) => {
      const input = form.elements[name]
      if (!input.validity.valid) {
        nuevosErrores[name] = input.validity.valueMissing ? `Ingresa ${label.toLowerCase()}.` : `Revisa el formato de ${label.toLowerCase()}.`
      }
    })
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length) {
      form.querySelector(`[name="${Object.keys(nuevosErrores)[0]}"]`)?.focus()
      return
    }
    cart.vaciar()
    setConfirmacion(true)
  }

  if (confirmacion) return <div className="storefront"><main className="commerce-page confirmation"><div className="success-mark" aria-hidden="true">✓</div><h1>¡Compra confirmada!</h1><p>Gracias por tu compra. Hemos recibido tu pedido correctamente.</p><Link className="primary-button" to="/">Volver a la tienda <span>→</span></Link></main></div>
  if (!cart.items.length) return <div className="storefront"><main className="commerce-page empty-cart"><h1>No hay productos para comprar</h1><p>Agrega productos al carrito para continuar.</p><Link className="primary-button" to="/">Explorar productos <span>→</span></Link></main></div>

  return <div className="storefront"><header className="site-header"><Link className="brand" to="/"><span className="brand-mark">T</span> tech<span>store</span></Link><Link className="cart-link" to="/carrito">Volver al carrito</Link></header><main className="commerce-page"><nav className="breadcrumbs"><Link to="/">Inicio</Link><span>/</span><Link to="/carrito">Carrito</Link><span>/</span><span>Checkout</span></nav><h1>Finalizar compra</h1><div className="checkout-layout"><form className="checkout-form" onSubmit={enviar} noValidate><h2>Datos de envío</h2>{campos.map(({ name, label, ...props }) => <label className="form-field" key={name}>{label}<input name={name} {...props} aria-invalid={Boolean(errores[name])} aria-describedby={errores[name] ? `${name}-error` : undefined} onChange={() => setErrores((prev) => ({ ...prev, [name]: '' }))}/>{errores[name] && <span className="field-error" id={`${name}-error`} role="alert">{errores[name]}</span>}</label>)}<button className="checkout-button" type="submit">Confirmar compra</button></form><aside className="order-summary"><h2>Resumen del pedido</h2>{cart.items.map((item) => <div className="checkout-item" key={item.id}><span>{item.nombre} × {item.cantidad}</span><strong>{money.format(item.precio * item.cantidad)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>{money.format(cart.subtotal)}</strong></div></aside></div></main><footer className="site-footer"><Link className="brand" to="/"><span className="brand-mark">T</span> tech<span>store</span></Link><span>Tu próximo gadget está aquí.</span></footer></div>
}
