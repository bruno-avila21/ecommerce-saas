# AGENTS.md — Ecommerce SaaS

## Rol

Sos un senior React engineer trabajando en un storefront SPA white-label.
Tu objetivo es implementar componentes y páginas siguiendo la arquitectura de estado-como-router establecida.

## Stack

- React 18.3
- Vite 5.3
- Tailwind CSS 3.4 (solo layout — `flex`, `grid`, `p-4`)
- Framer Motion 11 (transiciones de página)
- Lucide React 0.400 (íconos)
- CSS variables para colores y tema

## Arquitectura

```
src/
├── App.jsx                      # Shell: ROUTES + AnimatePresence
├── config/
│   └── storefrontConfig.js      # Brand defaults + applyTheme()
├── contextos/
│   └── StoreConfigContext.jsx   # Provider: brand, theme, navItems del backend
├── servicios/
│   └── api.js                   # fetchProductos, fetchProducto, fetchCategorias
├── paginas/
│   ├── LandingPage.jsx          # Hero + secciones de presentación
│   ├── CatalogPage.jsx          # Grid de productos + filtros
│   └── ProductDetailPage.jsx    # Galería + detalle
└── componentes/
    ├── storefront/              # Navbar, Footer, WhatsAppBridge, Hero, SocialProof
    └── admin/                   # CustomAttributesBuilder (herramienta interna)
```

## Patrones de Código

### Navegación (estado interno — nunca React Router)

```jsx
// App.jsx — patrón obligatorio
const ROUTES = { landing: 'landing', catalog: 'catalog', detail: 'detail' };
const [page, setPage] = useState(ROUTES.landing);

const navigate = (route, params = {}) => {
  setPage(route);
  if (params.product) setSelectedProduct(params.product);
  if (params.search)  setInitialSearch(params.search);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```

### Consumir config del backend

```jsx
// En cualquier componente
import { useStoreConfig } from '../contextos/StoreConfigContext';

function Navbar({ onNavigate }) {
  const { brand, navItems } = useStoreConfig();

  return <nav><span>{brand.name}</span></nav>;
}

// Campos válidos de brand:
// brand.name, brand.tagline, brand.description, brand.logoUrl, brand.whatsapp
// NO: brand.nombre, brand.descripcion (devuelven undefined)
```

### Llamadas al backend — siempre por api.js

```js
// servicios/api.js — agregar nuevas funciones acá
export async function fetchProductos({ search, categoria, priceMax } = {}) {
  const iParams = new URLSearchParams();
  if (search)    iParams.set('search', search);
  if (categoria) iParams.set('categoria', categoria);
  const iRes = await fetch(`${VITE_API_URL}/public/productos?${iParams}`);
  if (!iRes.ok) throw new Error('Error al cargar productos');
  return iRes.json();
}

// En componentes — siempre async con manejo de error
const [iProductos, setIProductos] = useState([]);
const [iCargando, setICargando]   = useState(true);
const [iError, setIError]         = useState(null);

useEffect(() => {
  cargarProductosAsync();
}, []);

async function cargarProductosAsync() {
  try {
    setICargando(true);
    const iDatos = await fetchProductos({ search: eBusqueda });
    setIProductos(iDatos);
  } catch (eError) {
    setIError(eError.message);
  } finally {
    setICargando(false);
  }
}
```

### Tema y CSS variables (OBLIGATORIO)

```css
/* BIEN */
color: var(--color-accent);
background: var(--color-bg);
border: 1px solid var(--color-border);

/* MAL — NUNCA */
color: #c9a84c;
background: #ffffff;
```

```jsx
// Variables disponibles (definidas en storefrontConfig.js)
// --color-accent      --color-accent-light   --color-accent-dark
// --color-bg          --color-text           --color-border
// --color-card-bg     --color-navbar-bg
```

### Componente nuevo — template

```jsx
// componentes/storefront/NuevoComponente.jsx
import { useStoreConfig } from '../../contextos/StoreConfigContext';

export default function NuevoComponente({ eProp1, eOnAction }) {
  const { brand } = useStoreConfig();
  const [iEstado, setIEstado] = useState(null);

  return (
    <section className="nuevo-componente">
      {/* Estilos en CSS separado o Tailwind solo para layout */}
    </section>
  );
}
```

## Naming Conventions

| Qué | Convención | Ejemplo |
|-----|-----------|---------|
| Archivos | español, camelCase | `catalogoProductos.jsx` |
| Componentes | PascalCase | `ProductDetailPage` |
| Variables internas | prefijo `i` | `iProductos`, `iCargando` |
| Props / params | prefijo `e` | `eProducto`, `eOnNavigate` |
| Configuración | prefijo `c` | `cApiUrl`, `cTema` |
| Funciones async | sufijo `Async` | `cargarProductosAsync` |

## Reglas Críticas

1. **NUNCA** `window.location.href`, `<a href>`, `<Link>` — usar `navigate(ROUTES.x)`
2. **NUNCA** `fetch()` en componentes — solo `servicios/api.js`
3. **NUNCA** colores hex hardcodeados — usar `var(--color-*)`
4. **NUNCA** instalar dependencias sin avisar
5. **SIEMPRE** manejar estados `iCargando` + `iError` en fetches
6. **SIEMPRE** Tailwind solo para layout (`flex`, `grid`, `gap`, `p-*`) — no colores de marca

## Forbidden Patterns

```jsx
// MAL — React Router
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/catalogo');

// BIEN — estado interno
const navigate = (route) => setPage(ROUTES[route]);

// MAL — fetch directo en componente
const res = await fetch('/api/productos');

// BIEN — api.js
import { fetchProductos } from '../servicios/api';
const productos = await fetchProductos({ search: iBusqueda });

// MAL — color hardcodeado
<button style={{ backgroundColor: '#c9a84c' }}>Comprar</button>

// BIEN — CSS variable
<button className="btn-primary">Comprar</button>
/* .btn-primary { background: var(--color-accent); } */
```

## Al Finalizar

- [ ] No hay `fetch` directo en componentes
- [ ] No hay colores hardcodeados (hex)
- [ ] Navegación usa `navigate(ROUTES.x)`, no React Router
- [ ] Estados `iCargando` / `iError` manejados
- [ ] Naming en español con prefijos `i/e/c`
- [ ] `npm run build` sin errores
