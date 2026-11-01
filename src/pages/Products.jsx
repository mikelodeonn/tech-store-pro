import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, getCategories } from "../services/productService";
import { getCatalogView } from "../utils/catalog";
import ProductCard from "../components/ProductCard";

export default function Products() {
  // Manejo de parámetros en la URL (búsqueda, filtros, paginación)
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lectura de filtros actuales desde la URL (o valores por defecto)
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  const page = Number(params.get("page")) || 1;

  // Carga inicial de productos y categorías al montar el componente
  useEffect(() => {
    Promise.all([getAllProducts(), getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Actualiza los parámetros de la URL y reinicia la página si cambia un filtro
  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  // Obtiene los productos filtrados, ordenados y paginados para la vista actual
  const view = getCatalogView(products, { q, category, sort, page });

  return (
    <section>
      <h1>Productos</h1>

      {/* Controles de búsqueda, filtros y ordenamiento */}
      <div className="filters">
        <input
          type="search"
          placeholder="Buscar por nombre..."
          value={q}
          onChange={(e) => update("q", e.target.value)}
        />

        <select value={category} onChange={(e) => update("category", e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => update("sort", e.target.value)}>
          <option value="">Orden predeterminado</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
        </select>

        <button onClick={() => setParams({})}>Limpiar filtros</button>
      </div>

      <p>{view.total} resultado(s)</p>

      {/* Listado de tarjetas de productos o mensaje de vacío */}
      {view.items.length === 0 ? (
        <p>No se encontraron productos con esos filtros.</p>
      ) : (
        <div className="product-grid">
          {view.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Controles de paginación */}
      {view.totalPages > 1 && (
        <nav className="pagination">
          <button disabled={view.page === 1} onClick={() => update("page", view.page - 1)}>
            Anterior
          </button>
          <span>Página {view.page} de {view.totalPages}</span>
          <button
            disabled={view.page === view.totalPages}
            onClick={() => update("page", view.page + 1)}
          >
            Siguiente
          </button>
        </nav>
      )}
    </section>
  );
}