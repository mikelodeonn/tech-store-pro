function Cart({ carrito = [], onEliminarDelCarrito, onFinalizarCompra }) {
  
  const total = carrito.reduce((acc, prod) => acc + (prod.precio * (prod.cantidad || 1)), 0);
  const totalItems = carrito.reduce((acc, prod) => acc + (prod.cantidad || 1), 0);

  return (
    <aside className="carrito-aside">
      <div className="carrito-header">
        <h3>🛒 Tu Carrito</h3>
        <span className="carrito-contador">{totalItems} ítems</span>
      </div>

      <div className="carrito-contenido">
        {carrito.length === 0 ? (
          <p className="carrito-vacio">El carrito está vacío</p>
        ) : (
          <ul className="lista-carrito">
            {carrito.map((prod) => (
              <li key={prod.nombre} className="carrito-item">
                <div>
                <span>{prod.icono} {prod.nombre}</span>
                  <span className="carrito-cantidad">
                    Cantidad: {prod.cantidad || 1}
                  </span>
                  <span>${prod.precio}</span>
                </div>
                <button
                  className="btn-eliminar"
                  type="button"
                  onClick={() => onEliminarDelCarrito(prod.id)}
                  aria-label={`Quitar ${prod.nombre} del carrito`}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="carrito-footer">
        <div className="carrito-total">
          <span>Total:</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
        <button
          className="btn-checkout"
          disabled={carrito.length === 0}
          onClick={onFinalizarCompra}
        >
          Proceder al pago
        </button>
      </div>
    </aside>
  );
}

export default Cart;
