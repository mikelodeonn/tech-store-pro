# Tech Store Pro

Tienda en línea hecha con React, React Router y la API de DummyJSON.

##Características principales

- Filtros sincronizados con la URL (`useSearchParams`): Las búsquedas, categorías, ordenamientos y la paginación se reflejan en la URL, permitiendo compartir enlaces exactos y usar el historial del navegador.
- Paginación inteligente: El cambio de cualquier filtro reinicia automáticamente la paginación a la primera página para evitar resultados vacíos.
- Carga asíncrona optimizada: Peticiones concurrentes (`Promise.all`) para la carga inicial de productos y categorías.
- Arquitectura modular:** Separación clara entre componentes, páginas, servicios y lógica reutilizable.

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
- `utils/` Logica reutilizable

## Servicios disponibles

- `getProducts(limit, skip)`
- `getProductById(id)`
- `getCategories()`
- `getProductsByCategory(category)`
- `searchProducts(query)`
- `getAllProducts()`

Nota:Readme temporal