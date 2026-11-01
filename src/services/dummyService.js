const API_BASE_URL = 'https://dummyjson.com/products'

/** Convierte el producto de DummyJSON a un formato único para la aplicación. */
function adaptarProducto(productoApi) {
  return {
    id: productoApi.id,
    nombre: productoApi.title,
    descripcion: productoApi.description ?? '',
    categoria: productoApi.category ?? '',
    marca: productoApi.brand ?? '',
    precio: productoApi.price ?? 0,
    descuento: productoApi.discountPercentage ?? 0,
    calificacion: productoApi.rating ?? 0,
    existencias: productoApi.stock ?? 0,
    imagen: productoApi.thumbnail ?? productoApi.images?.[0] ?? '',
    imagenes: productoApi.images ?? [],
  }
}

async function solicitar(endpoint = '', parametros = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`)

  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(clave, String(valor))
    }
  })

  let respuesta
  try {
    respuesta = await fetch(url)
  } catch (error) {
    throw new Error('No fue posible conectar con el servicio de productos.', {
      cause: error,
    })
  }

  if (!respuesta.ok) {
    throw new Error(`Error al consultar productos (${respuesta.status}).`)
  }

  return respuesta.json()
}

/** Obtiene productos para la cuadrícula, con paginación opcional. */
export async function obtenerProductos({ limite = 30, saltar = 0 } = {}) {
  const datos = await solicitar('', { limit: limite, skip: saltar })

  if (!Array.isArray(datos.products)) {
    throw new Error('La respuesta de productos no tiene el formato esperado.')
  }

  return {
    productos: datos.products.map(adaptarProducto),
    total: datos.total ?? datos.products.length,
    saltar: datos.skip ?? saltar,
    limite: datos.limit ?? limite,
  }
}

/** Obtiene productos de categorías de tecnología para la página de inicio. */
export async function obtenerProductosDestacados(limite = 8) {
  const categoriasTecnologia = ['smartphones', 'laptops', 'tablets', 'mobile-accessories']
  const datosPorCategoria = await Promise.all(
    categoriasTecnologia.map((categoria) =>
      solicitar(`/category/${encodeURIComponent(categoria)}`, { limit: limite }),
    ),
  )

  const productosPorCategoria = datosPorCategoria.map((datos) =>
    Array.isArray(datos.products) ? datos.products : [],
  )
  const seleccion = []

  for (let indice = 0; seleccion.length < limite; indice += 1) {
    let seAgregoProducto = false

    for (const productos of productosPorCategoria) {
      if (productos[indice] && seleccion.length < limite) {
        seleccion.push(productos[indice])
        seAgregoProducto = true
      }
    }

    if (!seAgregoProducto) break
  }

  return seleccion.map(adaptarProducto)
}

/** Obtiene un producto para la vista de detalle. */
export async function obtenerProductoPorId(id) {
  if (!Number.isInteger(Number(id)) || Number(id) < 1) {
    throw new Error('El identificador del producto no es válido.')
  }

  const producto = await solicitar(`/${Number(id)}`)

  if (!producto?.id) {
    throw new Error('No se encontró el producto solicitado.')
  }

  return adaptarProducto(producto)
}

/** Obtiene las categorías disponibles para filtros o navegación. */
export async function obtenerCategorias() {
  const categorias = await solicitar('/category-list')

  if (!Array.isArray(categorias)) {
    throw new Error('La respuesta de categorías no tiene el formato esperado.')
  }

  return categorias
}

/** Filtra productos por categoría. */
export async function obtenerProductosPorCategoria(categoria, { limite = 30, saltar = 0 } = {}) {
  if (!categoria?.trim()) {
    throw new Error('Debes indicar una categoría.')
  }

  const datos = await solicitar(`/category/${encodeURIComponent(categoria.trim())}`, {
    limit: limite,
    skip: saltar,
  })

  if (!Array.isArray(datos.products)) {
    throw new Error('La respuesta de productos no tiene el formato esperado.')
  }

  return {
    productos: datos.products.map(adaptarProducto),
    total: datos.total ?? datos.products.length,
    saltar: datos.skip ?? saltar,
    limite: datos.limit ?? limite,
  }
}

/** Busca productos por nombre o descripción. */
export async function buscarProductos(consulta, { limite = 30, saltar = 0 } = {}) {
  if (!consulta?.trim()) {
    return obtenerProductos({ limite, saltar })
  }

  const datos = await solicitar('/search', {
    q: consulta.trim(),
    limit: limite,
    skip: saltar,
  })

  if (!Array.isArray(datos.products)) {
    throw new Error('La respuesta de búsqueda no tiene el formato esperado.')
  }

  return {
    productos: datos.products.map(adaptarProducto),
    total: datos.total ?? datos.products.length,
    saltar: datos.skip ?? saltar,
    limite: datos.limit ?? limite,
  }
}
