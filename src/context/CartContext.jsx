import { createContext, useContext, useEffect, useReducer } from "react";

const STORAGE_KEY = "cart";
const CartContext = createContext(null);

function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function cartReducer(items, action) {
  switch (action.type) {
    case "ADD": {
      const p = action.product;
      const existing = items.find((i) => i.id === p.id);
      if (existing) {
        return items.map((i) =>
          i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...items,
        { id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, quantity: 1 },
      ];
    }
    case "INCREASE":
      return items.map((i) =>
        i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    case "DECREASE":
      return items.map((i) =>
        i.id === action.id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      );
    case "REMOVE":
      return items.filter((i) => i.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // almacenamiento lleno o bloqueado: el carrito sigue funcionando en memoria
    }
  }, [items]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = {
    items,
    totalItems,
    total,
    addItem: (product) => dispatch({ type: "ADD", product }),
    increase: (id) => dispatch({ type: "INCREASE", id }),
    decrease: (id) => dispatch({ type: "DECREASE", id }),
    removeItem: (id) => dispatch({ type: "REMOVE", id }),
    clearCart: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}