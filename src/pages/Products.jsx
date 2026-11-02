import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { getAllProducts, getCategories } from "../services/productService";
import { getCatalogView } from "../utils/catalog";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "";
  const page = Number(params.get("page")) || 1;

  useEffect(() => {
    Promise.all([getAllProducts(), getCategories()])
      .then(([allProducts, allCategories]) => {
        setProducts(allProducts);
        setCategories(allCategories);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  if (loading) return <div className="notice">Cargando catálogo…</div>;
  if (error) return <div className="notice notice--error">No pudimos cargar los productos: {error}</div>;

  const view = getCatalogView(products, { q, category, sort, page });
  const hasFilters = q || category || sort;

  return (
    <section className="catalog-page">
      <header className="catalog-heading">
        <p className="eyebrow">Descubre tu próximo favorito</p>
        <div className="catalog-heading__row">
          <h1 className="page-title">El catálogo<span>.</span></h1>
          <span className="catalog-heading__total">{view.total} productos</span>
        </div>
      </header>

      <div className="catalog-filters">
        <label className="search-field">
          <span className="visually-hidden">Buscar productos</span>
          <Search size={17} />
          <input type="search" placeholder="Buscar un producto…" value={q} onChange={(event) => update("q", event.target.value)} />
        </label>
        <label className="visually-hidden" htmlFor="category-filter">Categoría</label>
        <select id="category-filter" value={category} onChange={(event) => update("category", event.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
        <label className="visually-hidden" htmlFor="sort-filter">Ordenar productos</label>
        <select id="sort-filter" value={sort} onChange={(event) => update("sort", event.target.value)}>
          <option value="">Orden recomendado</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
        </select>
        <button onClick={() => setParams({})} disabled={!hasFilters} className="clear-filters">
          <SlidersHorizontal size={16} /><span className="clear-filters__mobile">Filtros</span>
          <X size={15} /><span className="clear-filters__desktop">Limpiar</span>
        </button>
      </div>

      {view.items.length === 0 ? (
        <div className="empty-results">
          <p className="empty-results__title">No encontramos resultados</p>
          <p className="empty-results__copy">Prueba con otra búsqueda o limpia los filtros.</p>
          <button onClick={() => setParams({})} className="button button--primary">Ver todo el catálogo</button>
        </div>
      ) : (
        <div className="product-grid">
          {view.items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}

      {view.totalPages > 1 && (
        <nav className="pagination" aria-label="Paginación">
          <button disabled={view.page === 1} onClick={() => update("page", view.page - 1)} aria-label="Página anterior"><ArrowLeft size={17} /></button>
          <span>{view.page} <span className="pagination__total">/ {view.totalPages}</span></span>
          <button disabled={view.page === view.totalPages} onClick={() => update("page", view.page + 1)} aria-label="Página siguiente"><ArrowRight size={17} /></button>
        </nav>
      )}
    </section>
  );
}
