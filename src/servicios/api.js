/**
 * API Service — conectado al backend de stock-product
 * Base URL: http://localhost:3001  (proxy via Vite en dev, env var en prod)
 *
 * NOTA SOBRE AUTENTICACIÓN:
 * El backend actual requiere JWT para /api/productos.
 * Para el storefront público hay dos opciones:
 *   A) Agregar un endpoint público al backend (recomendado):
 *      app.get('/api/public/productos', obtenerProductosPublicos)
 *   B) Usar las credenciales del admin (solo mientras no hay ruta pública).
 *
 * Actualmente implementada la opción B con auto-login usando un usuario
 * de solo lectura. Cambia a opción A cuando agregues el endpoint público.
 */

const BASE = import.meta.env.VITE_API_URL || "/api";

// ─── Token cache (en memoria, se pierde al recargar — OK para storefront) ─────
let _token = null;
let _tokenExpiry = 0;

async function getToken() {
  const now = Date.now();
  if (_token && now < _tokenExpiry) return _token;

  // Auto-login con credenciales de solo lectura para el storefront
  const email    = import.meta.env.VITE_STOREFRONT_USER || "admin@stock.com";
  const password = import.meta.env.VITE_STOREFRONT_PASS || "venta2025";

  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    console.warn("[api] Auto-login falló. Agrega VITE_STOREFRONT_USER y VITE_STOREFRONT_PASS en .env");
    return null;
  }

  const data = await res.json();
  _token = data.datos?.token || data.token;
  _tokenExpiry = now + 55 * 60 * 1000; // 55 min
  return _token;
}

async function request(path, options = {}) {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ mensaje: res.statusText }));
    throw new Error(err.mensaje || `Error ${res.status}`);
  }

  return res.json();
}

// ─── Productos ─────────────────────────────────────────────────────────────────

/**
 * Obtiene todos los productos activos del backend.
 * Mapea el esquema del inventario al esquema del storefront.
 */
export async function fetchProductos(params = {}) {
  const data = await request("/productos");
  let productos = (data.datos || []).map(mapProducto);

  // Filtros en cliente (mover al backend para performance en escala)
  if (params.search) {
    const q = params.search.toLowerCase();
    productos = productos.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        JSON.stringify(p.specs).toLowerCase().includes(q)
    );
  }
  if (params.category && params.category !== "Todos") {
    productos = productos.filter((p) => p.category === params.category);
  }
  if (params.priceMax) {
    productos = productos.filter((p) => p.price <= params.priceMax);
  }

  return productos;
}

/**
 * Obtiene un producto por ID.
 */
export async function fetchProducto(id) {
  const data = await request(`/productos/${id}`);
  return mapProducto(data.datos);
}

/**
 * Obtiene las imágenes de un producto.
 */
export async function fetchImagenesProducto(id) {
  try {
    const data = await request(`/productos/${id}/imagenes`);
    const uploads = import.meta.env.VITE_UPLOADS_URL || "http://localhost:3001/uploads";
    return (data.datos || []).map((img) => ({
      id: img.id,
      url: img.nombre_archivo
        ? `${uploads}/productos/${img.nombre_archivo}`
        : "/api/placeholder/640/480",
      esPrincipal: img.es_principal === 1,
    }));
  } catch {
    return [];
  }
}

/**
 * Obtiene las categorías disponibles.
 */
export async function fetchCategorias() {
  const data = await request("/categorias");
  return (data.datos || []).map((c) => ({
    id: c.id,
    label: c.nombre,
    color: c.color,
  }));
}

// ─── Schema Mapper: backend → storefront ──────────────────────────────────────
/**
 * Transforma un producto del esquema de inventario (stock-product)
 * al esquema esperado por los componentes del storefront.
 *
 * Ajustá los campos según tu esquema real de base de datos.
 */
function mapProducto(p) {
  if (!p) return null;

  const uploads = import.meta.env.VITE_UPLOADS_URL || "http://localhost:3001/uploads";
  const imagenPrincipal = p.imagen_principal
    ? `${uploads}/productos/${p.imagen_principal}`
    : "/api/placeholder/640/480";

  // Calcular precio de venta desde el backend
  // El backend maneja: precio_costo, precio_venta, porcentaje_ganancia
  const precioVenta = p.precio_venta || p.precio_costo || 0;

  // Construir specs dinámicos desde los campos del producto
  const specs = {};
  if (p.categoria_nombre) specs.categoria = p.categoria_nombre;
  if (p.descripcion)       specs.descripcion = p.descripcion;
  // Campos personalizados (si los guardas en un JSON en la DB)
  if (p.atributos_custom) {
    try {
      Object.assign(specs, JSON.parse(p.atributos_custom));
    } catch { /* ignore */ }
  }

  return {
    id:          p.id,
    title:       p.nombre,
    price:       precioVenta,
    priceCosto:  p.precio_costo,
    stock:       p.stock,
    category:    p.categoria_nombre || "General",
    categoryId:  p.categoria_id,
    provider:    p.proveedor_nombre,
    description: p.descripcion || "",
    images:      [imagenPrincipal],
    featured:    false, // podés agregar un campo 'destacado' al schema
    tags:        p.stock <= 0 ? ["sin stock"] : p.stock <= 5 ? ["últimas unidades"] : [],
    specs,
    specGroups: {
      "Información": Object.keys(specs).filter(k => k !== "descripcion"),
    },
    specLabels: {
      categoria:   "Categoría",
      descripcion: "Descripción",
    },
    raw: p, // datos originales por si los necesitás
  };
}

// ─── Ventas (Admin) ────────────────────────────────────────────────────────────

export async function fetchVentas(params = {}) {
  const query = new URLSearchParams(params).toString();
  const data = await request(`/ventas${query ? `?${query}` : ""}`);
  return data.datos || [];
}

export async function crearVenta(ventaData) {
  return request("/ventas", {
    method: "POST",
    body: JSON.stringify(ventaData),
  });
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export async function fetchDashboard(periodo = "mes") {
  const data = await request(`/dashboard?periodo=${periodo}`);
  return data.datos || data;
}

// ─── Gastos ────────────────────────────────────────────────────────────────────

export async function fetchGastos() {
  const data = await request("/gastos");
  return data.datos || [];
}

// ─── Pedidos ────────────────────────────────────────────────────────────────────

export async function fetchPedidos() {
  const data = await request("/pedidos");
  return data.datos || [];
}
