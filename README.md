# Tech Store Pro

Tienda en línea hecha con React, React Router y la API de DummyJSON.

## Cómo iniciar

npm install
npm run dev

## Rutas

- `/` Inicio
- `/productos` Listado de productos
- `/productos/:id` Detalle de producto

## Estructura

- `components/` Componentes reutilizables
- `layouts/` Layout principal (navbar + Outlet)
- `pages/` Páginas de cada ruta
- `services/` Llamadas a la API
- `models/` Modelo de producto
- `routes/` Configuración del router

## Servicios disponibles

- `getProducts(limit, skip)`
- `getProductById(id)`
- `getCategories()`
- `getProductsByCategory(category)`
- `searchProducts(query)`

Nota:Readme temporal