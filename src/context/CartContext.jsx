import { createContext, useContext, useEffect, useReducer } from "react";
import { getFinalPrice } from "../utils/pricing";

// Contexto de carrito de compras que usa una clave para guardar y leer en localStorage; y un contenedor global
const STORAGE_KEY = "cart";
const CartContext = createContext(null);

// Función que carga el carrito desde el localStorage y lo devuelve como un array. Si no hay carrito, devuelve un array vacío.
function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];
    return data.filter(
      (item) => Number.isFinite(item.quantity)
        && item.quantity > 0
        && Number.isFinite(item.price)
        && Number.isFinite(item.originalPrice),
    );
  } catch {
    return [];
  }
}

// Función reductora que maneja las acciones del carrito de compras. Recibe el estado actual del carrito y una acción, y
// devuelve el nuevo estado del carrito según el tipo de acción.
function cartReducer(items, action) {
  switch (action.type) {
    // Agrega un producto al carrito. Si el producto ya existe, aumenta su cantidad en 1; si no, lo agrega con cantidad 1.
    case "ADD":
      {
        const p = action.product;
        const existing = items.find((i) => i.id === p.id);
        if (existing) {
          // Si el producto ya existe, aumenta su cantidad en 1, pero no permite que la cantidad sea mayor al stock disponible.
          return items.map((i) =>
            i.id === p.id ? { ...i, quantity: Math.min(i.quantity + 1, i.stock)  } : i,
          );
        }

        return [
          ...items,
          {
            id: p.id,
            title: p.title,
            price: getFinalPrice(p),
            originalPrice: p.price,
            thumbnail: p.thumbnail,
            quantity: 1,
            stock: p.stock,
          },
        ];
      }

      // Aumenta la cantidad de un producto en el carrito en 1, pero no permite que la cantidad sea mayor al stock disponible.   
      case "INCREASE":
      return items.map((i) =>
        i.id === action.id
          ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
          : i,
      );
    // Disminuye la cantidad de un producto en el carrito en 1, pero no permite que la cantidad sea menor a 1.
    case "DECREASE":
      return items.map((i) =>
        i.id === action.id && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i,
      );
    // Elimina un producto del carrito según su id.
    case "REMOVE":
      return items.filter((i) => i.id !== action.id);
    // Limpia el carrito, devolviendo un array vacío.
    case "CLEAR":
      return [];
    // Si la acción no coincide con ningún caso, devuelve el estado actual del carrito sin cambios.
    default:
      return items;
  }
}

// Componente que provee el contexto del carrito  a los componentes hijos.
export function CartProvider({ children }) {
  // Mantiene el estado del carrito usando un reductor y carga el carrito desde el localStorage al montar el componente.
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  // Guarda el carrito en el localStorage cada vez que cambia el estado del carrito. Si falla, el carrito sigue funcionando
  // en memoria.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  // Calcula el número total de artículos y el total del carrito sumando las cantidades y los precios de los productos.
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const savings = items.reduce(
    (sum, i) => sum + (i.originalPrice - i.price) * i.quantity,
    0,
  );

  // Valor del contexto que se provee a los componentes hijos. Contiene el array de artículos, el número total de artículos,
  // el total del carrito y las funciones para agregar, aumentar, disminuir, eliminar y limpiar artículos.
  const value = {
    items,
    totalItems,
    total,
    savings,
    addItem: (product) => dispatch({ type: "ADD", product }),
    increase: (id) => dispatch({ type: "INCREASE", id }),
    decrease: (id) => dispatch({ type: "DECREASE", id }),
    removeItem: (id) => dispatch({ type: "REMOVE", id }),
    clearCart: () => dispatch({ type: "CLEAR" }),
  };
  // Renderiza el proveedor de contexto con el valor y los componentes hijos.
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
// Hook que permite acceder al contexto del carrito desde cualquier componente hijo. Lanza un error si se intenta usar
// fuera del proveedor de contexto.
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
