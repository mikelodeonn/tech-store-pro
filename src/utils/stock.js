export const LOW_STOCK_THRESHOLD = 50;

export function getStockStatus(stock) {
  if (stock <= 0) return { key: "out", label: "No disponible" };
  if (stock <= LOW_STOCK_THRESHOLD) return { key: "low", label: `Quedan pocas unidades` };
  return { key: "ok", label: "Disponible" };
}