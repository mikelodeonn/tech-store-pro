function ProductCard({ producto, stock, onAgregar }) {
  const sinStock = stock <= 0;

  return (
    <article className="producto">
      {producto.imagen ? (
        <img className="producto_imagen" src={producto.imagen} alt={producto.nombre} />
      ) : (
        <div className="producto_icono" aria-hidden="true">{producto.icono ?? "📦"}</div>
      )}
      <p className="producto_categoria">{producto.categoria}</p>
      <h3>{producto.nombre}</h3>
      <p className="producto_precio">${producto.precio.toLocaleString("es-MX")}</p>
      <p className={`producto_stock ${sinStock ? "producto_terminado" : ""}`}>
        {sinStock ? "Agotado" : `Disponibles: ${stock}`}
      </p>
      <button type="button" onClick={onAgregar} disabled={sinStock}>
        {sinStock ? "No disponible" : "Agregar al carrito"}
      </button>
    </article>
  );
}

export default ProductCard;
