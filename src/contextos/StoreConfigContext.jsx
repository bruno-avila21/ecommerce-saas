/**
 * StoreConfigContext — Single Source of Truth para la configuración de tienda
 *
 * Hidrata los datos desde el backend al montar la aplicación.
 * Mientras carga, los componentes ven los valores por defecto (lo mismo que
 * estaba hardcodeado), por lo que nunca hay pantalla en blanco.
 *
 * Uso en cualquier componente:
 *   const { brand, navItems, copy, theme } = useStoreConfig();
 *   <h1>{copy.hero_title}</h1>
 *   <span>{brand.nombre}</span>
 */

import { createContext, useContext, useEffect, useState } from "react";
import { BRAND, THEME } from "../config/storefrontConfig";

// ─── Valores por defecto ────────────────────────────────────────────────────
// Espejamos los valores hardcodeados existentes para que el primer render
// sea idéntico al estado anterior a este sistema.

const DEFAULT_NAV = [
  { label: "0km",              href: "#" },
  { label: "Usados",           href: "#", badge: "Hot" },
  { label: "Planes de ahorro", href: "#" },
  { label: "Posventa",         href: "#" },
  { label: "Empresas",         href: "#" },
  { label: "Seguros",          href: "#" },
  { label: "¿Dónde estamos?",  href: "#" },
  { label: "Novedades",        href: "#" },
];

const DEFAULT_COPY = {
  hero_title:      BRAND.tagline,
  hero_subtitle:   BRAND.description,
  hero_cta:        "Agendá tu test drive",
  footer_copyright:"© 2026 AutoLux. Todos los derechos reservados.",
  footer_tagline:  "Tu concesionaria de confianza",
  search_cta:      "Buscar",
};

const DEFAULT_BRAND = {
  nombre:      BRAND.name,
  tagline:     BRAND.tagline,
  descripcion: BRAND.description,
  logoUrl:     BRAND.logoUrl,
  whatsapp:    BRAND.whatsapp,
  email:       BRAND.email,
  website:     BRAND.website,
};

// URL del backend — en producción configurar VITE_API_BASE_URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// ─── Context ────────────────────────────────────────────────────────────────
const StoreConfigContext = createContext({
  brand:    DEFAULT_BRAND,
  navItems: DEFAULT_NAV,
  copy:     DEFAULT_COPY,
  theme:    {},
  loading:  true,
});

// ─── Provider ───────────────────────────────────────────────────────────────
export function StoreConfigProvider({ children }) {
  const [brand,    setBrand]    = useState(DEFAULT_BRAND);
  const [navItems, setNavItems] = useState(DEFAULT_NAV);
  const [copy,     setCopy]     = useState(DEFAULT_COPY);
  const [theme,    setTheme]    = useState({});
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchConfig() {
      try {
        const res  = await fetch(`${API_BASE}/api/tienda-config`);
        const json = await res.json();

        if (cancelled || !json.exito) return;

        const { branding, navigation, copywriting, theme: themeOverrides } = json.datos;

        if (branding)        setBrand(b    => ({ ...b,    ...branding    }));
        if (navigation?.length) setNavItems(navigation);
        if (copywriting)     setCopy(c     => ({ ...c,    ...copywriting }));
        if (themeOverrides)  setTheme(themeOverrides);

      } catch {
        // En caso de error de red mantenemos los defaults — la tienda sigue funcionando
        console.warn("[StoreConfig] No se pudo cargar la configuración del backend. Usando valores por defecto.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchConfig();
    return () => { cancelled = true; };
  }, []);

  return (
    <StoreConfigContext.Provider value={{ brand, navItems, copy, theme, loading }}>
      {children}
    </StoreConfigContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useStoreConfig() {
  return useContext(StoreConfigContext);
}
