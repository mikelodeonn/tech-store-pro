export const PAGE_SIZE = 12;

const sorters = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "name-asc": (a, b) => a.title.localeCompare(b.title),
  "name-desc": (a, b) => b.title.localeCompare(a.title),
};

export function getCatalogView(products, { q, category, sort, page }) {
  let result = products;

  const term = q.trim().toLowerCase();
  if (term) result = result.filter((p) => p.title.toLowerCase().includes(term));
  if (category) result = result.filter((p) => p.category === category);
  if (sorters[sort]) result = [...result].sort(sorters[sort]);

  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;

  return {
    items: result.slice(start, start + PAGE_SIZE),
    total,
    totalPages,
    page: safePage,
  };
}