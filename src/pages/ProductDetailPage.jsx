import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProductoPorId } from '../services/dummyService'

const formatoPrecio = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'USD',
})

function StoreHeader() {
  return (
    <>
      <div className="announcement">Tecnología para todos · Envíos a todo México</div>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="TechStore, inicio">
          <span className="brand-mark">T</span> tech<span>store</span>
        </Link>
        <nav className="main-nav" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/#productos">Productos</Link>
        </nav>
        <Link className="cart-link" to="/#productos">Ver productos <span aria-hidden="true">→</span></Link>
      </header>
    </>
  )
}

function ProductDetailPage() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [imagenActiva, setImagenActiva] = useState('')

  useEffect(() => {
    let activo = true
    setCargando(true)
    setError('')
    setProducto(null)

    obtenerProductoPorId(id)
      .then((productoCargado) => {
        if (activo) {
          setProducto(productoCargado)
          setImagenActiva(productoCargado.imagenes[0] || productoCargado.imagen)
        }
      })
      .catch((errorConsulta) => {
        if (activo) setError(errorConsulta.message || 'No se pudo cargar el producto.')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [id])

  return (
    <div className="storefront">
      <StoreHeader />
      <main className="detail-page">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link><span aria-hidden="true">/</span><span>Detalle del producto</span>
        </nav>

        {cargando && <p className="feedback-message" role="status">Cargando producto…</p>}
        {!cargando && error && (
          <section className="detail-feedback">
            <div className="detail-feedback-icon" aria-hidden="true">!</div>
            <h1>No encontramos ese producto</h1>
            <p>{error}</p>
            <Link className="primary-button" to="/">Volver a la tienda <span aria-hidden="true">→</span></Link>
          </section>
        )}

        {!cargando && !error && producto && (
          <section className="detail-layout">
            <div className="detail-gallery">
              <div className="detail-main-image">
                {producto.descuento > 0 && (
                  <span className="discount-badge">-{Math.round(producto.descuento)}% descuento</span>
                )}
                <img src={imagenActiva || producto.imagen} alt={producto.nombre} />
              </div>
              {producto.imagenes.length > 1 && (
                <div className="detail-thumbnails" aria-label="Imágenes del producto">
                  {producto.imagenes.map((imagen, indice) => (
                    <button
                      className={imagenActiva === imagen ? 'thumbnail-button active' : 'thumbnail-button'}
                      key={imagen}
                      type="button"
                      onClick={() => setImagenActiva(imagen)}
                      aria-label={`Ver imagen ${indice + 1} de ${producto.nombre}`}
                      aria-pressed={imagenActiva === imagen}
                    >
                      <img src={imagen} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="detail-info">
              <span className="eyebrow detail-category">{producto.categoria.replaceAll('-', ' ')}</span>
              <h1>{producto.nombre}</h1>
              <div className="detail-rating"><span aria-hidden="true">★</span> {producto.calificacion.toFixed(1)} <span>·</span> {producto.existencias} disponibles</div>
              {producto.marca && <p className="detail-brand">Marca: <strong>{producto.marca}</strong></p>}
              <p className="detail-description">{producto.descripcion}</p>
              <div className="detail-price">{formatoPrecio.format(producto.precio)}</div>
              <p className="detail-stock">{producto.existencias > 0 ? 'Disponible para envío' : 'Agotado'}</p>
              <Link className="detail-continue-link" to="/#productos">Seguir explorando productos <span aria-hidden="true">→</span></Link>
              <div className="detail-promises">
                <div><span aria-hidden="true">↗</span><span><strong>Envío a todo México</strong><small>Consulta cobertura al comprar</small></span></div>
                <div><span aria-hidden="true">◇</span><span><strong>Compra protegida</strong><small>Pago seguro y confiable</small></span></div>
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className="site-footer">
        <Link className="brand" to="/"><span className="brand-mark">T</span> tech<span>store</span></Link>
        <span>Tu próximo gadget está aquí.</span>
      </footer>
    </div>
  )
}

export default ProductDetailPage
