/**
 * Storefront Configuration — White-Label SaaS Framework
 * Override these values per client deployment via environment variables
 * or a remote config fetch at app init.
 */

export const BRAND = {
  name: import.meta.env.VITE_BRAND_NAME || "AutoLux",
  tagline: import.meta.env.VITE_BRAND_TAGLINE || "Encontrá tu próximo vehículo",
  description: import.meta.env.VITE_BRAND_DESC || "Los mejores vehículos seleccionados para vos.",
  logoUrl: import.meta.env.VITE_LOGO_URL || null,
  whatsapp: import.meta.env.VITE_WHATSAPP || "+5491112345678",
  email: import.meta.env.VITE_EMAIL || "contacto@autolux.com.ar",
  website: import.meta.env.VITE_WEBSITE || "https://autolux.com.ar",
};

// ─── CSS Custom Properties ────────────────────────────────────────────────────
// Inject these into :root at app startup to enable full white-label theming.
export const THEME = {
  "--sf-accent":        import.meta.env.VITE_ACCENT_COLOR    || "#c9a84c",
  "--sf-accent-light":  import.meta.env.VITE_ACCENT_LIGHT    || "#f5ecd4",
  "--sf-accent-dark":   import.meta.env.VITE_ACCENT_DARK     || "#a07830",
  "--sf-hero-bg":       import.meta.env.VITE_HERO_BG         || "#0a0a0a",
  "--sf-hero-text":     "#fafaf9",
  "--sf-page-bg":       "#fafaf9",
  "--sf-page-bg-2":     "#f0efeb",
  "--sf-text":          "#0a0a0a",
  "--sf-text-muted":    "#6b7280",
  "--sf-text-faint":    "#9ca3af",
  "--sf-border":        "#e5e3df",
  "--sf-border-strong": "#d1cfc9",
  "--sf-card-bg":       "#ffffff",
  "--sf-whatsapp":      "#25d366",
  "--sf-whatsapp-dark": "#128c3e",
  "--sf-radius":        "12px",
  "--sf-radius-sm":     "8px",
  "--sf-radius-lg":     "20px",
};

// ─── Product Schema ────────────────────────────────────────────────────────────
// Define default niches. Clients can extend via Admin UI.
export const NICHES = {
  vehiculos: {
    label: "Vehículos",
    icon: "🚗",
    defaultAttributes: [
      { key: "marca",       label: "Marca",         type: "text",   group: "general" },
      { key: "modelo",      label: "Modelo",        type: "text",   group: "general" },
      { key: "anio",        label: "Año",           type: "number", group: "general" },
      { key: "kilometraje", label: "Kilometraje",   type: "number", group: "técnico", suffix: "km" },
      { key: "combustible", label: "Combustible",   type: "select", group: "técnico",
        options: ["Nafta", "Diesel", "GNC", "Eléctrico", "Híbrido"] },
      { key: "transmision", label: "Transmisión",   type: "select", group: "técnico",
        options: ["Manual", "Automático", "CVT"] },
      { key: "color",       label: "Color",         type: "text",   group: "general" },
      { key: "puertas",     label: "Puertas",       type: "number", group: "técnico" },
      { key: "ubicacion",   label: "Ubicación",     type: "text",   group: "general" },
    ],
    filterFields: ["precio", "marca", "anio", "combustible", "transmision"],
    cardSpecs: ["anio", "kilometraje", "combustible"],
  },
  inmuebles: {
    label: "Inmuebles",
    icon: "🏠",
    defaultAttributes: [
      { key: "tipo",        label: "Tipo",          type: "select", group: "general",
        options: ["Casa", "Departamento", "Terreno", "Local", "Oficina"] },
      { key: "metros",      label: "Superficie",    type: "number", group: "técnico", suffix: "m²" },
      { key: "ambientes",   label: "Ambientes",     type: "number", group: "técnico" },
      { key: "dormitorios", label: "Dormitorios",   type: "number", group: "técnico" },
      { key: "banos",       label: "Baños",         type: "number", group: "técnico" },
      { key: "garage",      label: "Cochera",       type: "boolean",group: "adicional" },
      { key: "expensas",    label: "Expensas",      type: "number", group: "adicional", prefix: "$" },
      { key: "barrio",      label: "Barrio",        type: "text",   group: "general" },
      { key: "ciudad",      label: "Ciudad",        type: "text",   group: "general" },
    ],
    filterFields: ["precio", "tipo", "ambientes", "dormitorios", "metros"],
    cardSpecs: ["metros", "ambientes", "dormitorios"],
  },
  maquinaria: {
    label: "Maquinaria",
    icon: "⚙️",
    defaultAttributes: [
      { key: "marca",       label: "Marca",         type: "text",   group: "general" },
      { key: "modelo",      label: "Modelo",        type: "text",   group: "general" },
      { key: "anio",        label: "Año",           type: "number", group: "general" },
      { key: "horas",       label: "Horas de uso",  type: "number", group: "técnico", suffix: "hs" },
      { key: "potencia",    label: "Potencia",      type: "number", group: "técnico", suffix: "HP" },
      { key: "ubicacion",   label: "Ubicación",     type: "text",   group: "general" },
    ],
    filterFields: ["precio", "marca", "anio", "horas"],
    cardSpecs: ["anio", "horas", "potencia"],
  },
};

// ─── Locations ─────────────────────────────────────────────────────────────────
export const LOCATIONS = [
  {
    id: 1,
    name: "Casa Central",
    address: "Av. del Libertador 1234, Buenos Aires",
    hours: "Lun–Vie 9:00–19:00 · Sáb 9:00–14:00",
    phone: "+54 11 4000-0001",
    mapEmbed: "https://maps.google.com/?q=-34.5731,-58.4175",
    lat: -34.5731, lng: -58.4175,
  },
  {
    id: 2,
    name: "Sucursal Norte",
    address: "Ruta 9 Km 40, Pilar, Buenos Aires",
    hours: "Lun–Sáb 9:00–18:00",
    phone: "+54 230 400-0002",
    mapEmbed: "https://maps.google.com/?q=-34.4587,-58.9123",
    lat: -34.4587, lng: -58.9123,
  },
];

// ─── Highlights (Landing Page) ─────────────────────────────────────────────────
export const HIGHLIGHTS = [
  {
    icon: "Shield",
    title: "Garantía Certificada",
    desc: "Todos nuestros productos pasan por una revisión técnica exhaustiva de 150 puntos.",
    stat: "150+",
    statLabel: "puntos de inspección",
  },
  {
    icon: "CreditCard",
    title: "Financiación Propia",
    desc: "Planes a medida sin necesidad de banco. Cuotas fijas en pesos o dólares.",
    stat: "60",
    statLabel: "cuotas disponibles",
  },
  {
    icon: "Headphones",
    title: "Atención Personalizada",
    desc: "Asesoramiento experto antes, durante y después de tu compra. Sin letra chica.",
    stat: "24/7",
    statLabel: "soporte disponible",
  },
];

// ─── Testimonials ──────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Martina García",
    role: "Compradora verificada",
    avatar: null,
    rating: 5,
    text: "Excelente atención desde el primer contacto. El proceso fue rápido, transparente y sin sorpresas. Definitivamente recomiendo a cualquiera que esté buscando.",
    product: "Toyota Corolla 2022",
    date: "Febrero 2026",
  },
  {
    id: 2,
    name: "Rodrigo Méndez",
    role: "Cliente frecuente",
    avatar: null,
    rating: 5,
    text: "Ya es la tercera vez que compro aquí. El trato es impecable y los precios son los más competitivos del mercado. Siempre encuentro lo que busco.",
    product: "Ford Ranger 2023",
    date: "Enero 2026",
  },
  {
    id: 3,
    name: "Valentina Sosa",
    role: "Compradora verificada",
    avatar: null,
    rating: 5,
    text: "Me asesoraron perfectamente para encontrar el vehículo ideal dentro de mi presupuesto. La financiación fue sencilla y las cuotas cómodas.",
    product: "Volkswagen Polo 2023",
    date: "Diciembre 2025",
  },
];

// ─── FAQ ───────────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    q: "¿Cómo inicio el proceso de compra?",
    a: "Podés contactarnos directamente por WhatsApp con el ID del producto que te interesa. Nuestro equipo te asesorará sin compromiso y coordinará una visita o prueba de manejo.",
  },
  {
    q: "¿Aceptan vehículos usados como parte de pago?",
    a: "Sí, realizamos tasaciones sin cargo. Podés traer tu vehículo y lo evaluamos en el momento para ofrecerte el mejor valor de parte de pago.",
  },
  {
    q: "¿Los precios incluyen patentamiento y transferencia?",
    a: "Los precios publicados son de venta. Los gastos de patentamiento y transferencia se detallan por separado y te los informamos antes de cualquier compromiso.",
  },
  {
    q: "¿Tienen financiación disponible?",
    a: "Contamos con planes propios y también trabajamos con los principales bancos del país. Planes desde 12 hasta 60 cuotas con tasas preferenciales.",
  },
  {
    q: "¿Puedo reservar un producto de manera online?",
    a: "Sí. Con una seña mínima (que coordinamos vía WhatsApp) podés reservar cualquier producto por hasta 72 horas mientras definís los detalles de la operación.",
  },
];

// Utility: inject theme CSS variables into document root
export function applyTheme(overrides = {}) {
  const merged = { ...THEME, ...overrides };
  Object.entries(merged).forEach(([key, val]) => {
    document.documentElement.style.setProperty(key, val);
  });
}
