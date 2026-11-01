import ProductCard from "./ProductCard";

function CatalogoProductos({ productos, cargando, onAgregarAlCarrito, stockDisponible }) {
  if (cargando) return <p className="mensaje-cargando">Cargando productos...</p>;
  if (productos.length === 0) return <p className="mensaje-error">No hay productos disponibles.</p>;

  return (
    <div className="catalogo">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          stock={stockDisponible[producto.id] ?? producto.stock ?? 5}
          onAgregar={() => onAgregarAlCarrito(producto)}
        />
      ))}
    </div>
  );
}

export default CatalogoProductos;
