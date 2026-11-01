import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import { obtenerProductosDestacados } from './services/dummyService'
import './App.css'

const formatoPrecio = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'USD',
})

function ProductoCard({ producto }) {
  return (
    <Link className="product-card" to={`/producto/${producto.id}`}>
      <div className="product-image-wrap">
        {producto.descuento > 0 && (
          <span className="discount-badge">-{Math.round(producto.descuento)}%</span>
        )}
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
      </div>
      <div className="product-info">
        <span className="product-category">{producto.categoria.replaceAll('-', ' ')}</span>
        <h3>{producto.nombre}</h3>
        <div className="product-rating" aria-label={`Calificación ${producto.calificacion} de 5`}>
          <span aria-hidden="true">★</span> {producto.calificacion.toFixed(1)}
        </div>
        <div className="product-price-row">
          <strong>{formatoPrecio.format(producto.precio)}</strong>
          <span className="view-product" aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  )
}

function HomePage() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    obtenerProductosDestacados(8)
      .then((productosDestacados) => {
        if (activo) setProductos(productosDestacados)
      })
      .catch((errorConsulta) => {
        if (activo) setError(errorConsulta.message || 'No se pudieron cargar los productos.')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  return (
    <div className="storefront">
      <div className="announcement">Tecnología para todos · Envíos a todo México</div>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="TechStore, inicio">
          <span className="brand-mark">T</span> tech<span>store</span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#productos">Productos</a>
          <a href="#categorias">Categorías</a>
        </nav>
        <a className="cart-link" href="#productos">Ver productos <span aria-hidden="true">→</span></a>
      </header>

      <main>
        <section className="hero-banner" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow">TECNOLOGÍA PARA TU DÍA A DÍA</span>
            <h1>Lo último en tecnología, <span>a tu alcance.</span></h1>
            <p>Encuentra tus gadgets favoritos y dale un upgrade a tu mundo.</p>
            <a className="primary-button" href="#productos">Explorar productos <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-glow" />
            <div className="phone-art"><div className="phone-screen"><span>TECH</span><i /></div></div>
            <div className="art-chip chip-one">✦</div>
            <div className="art-chip chip-two">◉</div>
          </div>
        </section>

        <section className="benefits" id="categorias" aria-label="Beneficios de la tienda">
          <div><span className="benefit-icon">↗</span><span><strong>Envíos a todo México</strong><small>Rápidos y seguros</small></span></div>
          <div><span className="benefit-icon">◇</span><span><strong>Compra protegida</strong><small>Tu seguridad primero</small></span></div>
          <div><span className="benefit-icon">♡</span><span><strong>Atención personalizada</strong><small>Estamos para ayudarte</small></span></div>
        </section>

        <section className="featured-section" id="productos">
          <div className="section-heading">
            <div><span className="eyebrow">SELECCIÓN TECHSTORE</span><h2>Productos destacados</h2></div>
            <a href="#productos" className="text-link">Ver todos <span aria-hidden="true">→</span></a>
          </div>

          {cargando && <p className="feedback-message" role="status">Cargando productos destacados…</p>}
          {!cargando && error && <p className="feedback-message error-message" role="alert">{error}</p>}
          {!cargando && !error && productos.length === 0 && (
            <p className="feedback-message">No hay productos disponibles por el momento.</p>
          )}
          {!cargando && !error && productos.length > 0 && (
            <div className="product-grid">
              {productos.map((producto) => <ProductoCard key={producto.id} producto={producto} />)}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer"><a className="brand" href="#inicio"><span className="brand-mark">T</span> tech<span>store</span></a><span>Tu próximo gadget está aquí.</span></footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default App
