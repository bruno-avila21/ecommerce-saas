# CLAUDE.md — Ecommerce SaaS

## Repository Overview

Storefront SPA (React 18 + Vite) que se conecta al backend de stock-product.
No tiene backend propio. Desplegable como imagen Docker (Nginx sirve el build).

## Build & Development

```bash
npm install
npm run dev      # http://localhost:3000 (proxy /api → :3001)
npm run build    # genera dist/
npm run preview  # sirve el build
```

```bash
# Producción — Docker
docker build \
  --build-arg VITE_API_URL=https://api.tudominio.com/api \
  --build-arg VITE_BRAND_NAME=MiTienda \
  -t ecommerce-saas .
docker run -p 8080:8080 ecommerce-saas
```

## Architecture

- **App.jsx** — Shell: estado `page` como router. `AnimatePresence` entre páginas.
- **paginas/** — `LandingPage`, `CatalogPage`, `ProductDetailPage`.
- **componentes/storefront/** — Navbar, Footer, WhatsAppBridge, Hero, SocialProof.
- **componentes/admin/** — `CustomAttributesBuilder` (herramienta interna).
- **contextos/StoreConfigContext** — Hidrata config desde el backend (brand, theme, navItems).
- **servicios/api.js** — Único punto de contacto con el backend. Nunca `fetch` directo.
- **config/storefrontConfig.js** — Config de marca por defecto (fallback si backend no responde).

## Navegación

```js
const ROUTES = { landing: 'landing', catalog: 'catalog', detail: 'detail' };
const [page, setPage] = useState(ROUTES.landing);
navigate(ROUTES.catalog, { search: 'Toyota' });
```

**NUNCA:** `<Link>`, `useNavigate`, `window.location.href`, React Router.

## Naming Conventions

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `i` | Variables internas | `iProductos`, `iCargando` |
| `e` | Props / params externos | `eProducto`, `eOnNavigate` |
| `c` | Configuración | `cApiUrl`, `cTema` |

- Archivos: español, camelCase (`catalogoProductos.js`)
- Componentes: PascalCase (`ProductDetailPage`)
- Async: sufijo `Async` (`cargarProductosAsync`)

## Critical Rules

- **CSS variables SIEMPRE** — `var(--color-accent)`, nunca hex hardcodeado
- **NUNCA** llamar `fetch` directamente — usar `servicios/api.js`
- **NUNCA** React Router — navegación por estado interno (`page`)
- **VITE_*** vars se "queman" en build time (no son runtime)

## Variables de entorno (.env)

```env
VITE_API_URL=/api
VITE_UPLOADS_URL=http://localhost:3001/uploads
VITE_STOREFRONT_USER=admin
VITE_STOREFRONT_PASS=admin123
VITE_BRAND_NAME=AutoLux
VITE_BRAND_TAGLINE=Encontrá tu próximo vehículo
VITE_BRAND_DESC=Los mejores vehículos seleccionados para vos.
VITE_WHATSAPP=+5491112345678
VITE_EMAIL=contacto@autolux.com.ar
VITE_ACCENT_COLOR=#c9a84c
VITE_ACCENT_LIGHT=#f5ecd4
VITE_ACCENT_DARK=#a07830
```
