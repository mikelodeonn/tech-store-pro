import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'techstore-cart'

function leerCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(guardado) ? guardado.filter((item) => item?.id && Number(item.cantidad) > 0) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerCarrito)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo(() => ({
    items,
    cantidad: items.reduce((suma, item) => suma + item.cantidad, 0),
    subtotal: items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    agregar(producto) {
      setItems((actuales) => {
        const existente = actuales.find((item) => item.id === producto.id)
        return existente
          ? actuales.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
          : [...actuales, { id: producto.id, nombre: producto.nombre, imagen: producto.imagen, precio: producto.precio, cantidad: 1 }]
      })
    },
    cambiarCantidad(id, delta) {
      setItems((actuales) => actuales.map((item) => item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + delta) } : item))
    },
    quitar(id) { setItems((actuales) => actuales.filter((item) => item.id !== id)) },
    vaciar() { setItems([]) },
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}
