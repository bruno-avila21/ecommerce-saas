import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  SlidersHorizontal, X, ChevronDown, ChevronUp, Search,
  Grid3X3, List, Eye, MessageCircle, Heart,
  Loader2, AlertCircle, Tag,
} from "lucide-react";
import WhatsAppBridge from "../componentes/storefront/WhatsAppBridge";
import { fetchProductos } from "../servicios/api";

const SORT_OPTIONS = [
  { value: "default",    label: "Destacados primero" },
  { value: "price_asc",  label: "Menor precio" },
  { value: "price_desc", label: "Mayor precio" },
  { value: "name_asc",   label: "Nombre A–Z" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(v);

const fmtShort = (v) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1000
    ? `$${(v / 1000).toFixed(0)}k`
    : `$${v}`;

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onSelect, onWhatsApp, viewMode }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  // Toma los primeros 3 specs no-vacíos que tenga el producto (dinámico)
  const specPills = Object.entries(product.specs || {})
    .filter(([, v]) => v !== null && v !== undefined && v !== "" && v !== false)
    .slice(0, 3)
    .map(([k, v]) => ({
      label: product.specLabels?.[k] || k,
      value: typeof v === "boolean" ? "Sí" : String(v),
    }));

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.3 }}
        className="flex gap-4 p-4 rounded-[var(--sf-radius)] border border-[var(--sf-border)] bg-[var(--sf-card-bg)] hover:border-[var(--sf-border-strong)] transition-all cursor-pointer group"
        onClick={() => onSelect(product)}
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}
      >
        <div className="relative w-40 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.tags[0] && (
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  style={{ background: "var(--sf-accent)", color: "#0a0a0a" }}>
              {product.tags[0]}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 py-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-1"
             style={{ color: "var(--sf-accent)" }}>
            {product.category}
          </p>
          <h3 className="font-semibold text-[var(--sf-text)] text-base mb-2 leading-tight truncate"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            {product.title}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs text-[var(--sf-text-muted)]">
            {specPills.map(({ label, value }) => (
              <span key={label} className="flex items-center gap-1">
                <span className="text-[var(--sf-text-faint)]">{label}:</span> {value}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between py-1 flex-shrink-0">
          <p className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--sf-text)" }}>
            {fmt(product.price)}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onWhatsApp(product); }}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white"
            style={{ background: "var(--sf-whatsapp)" }}
          >
            <MessageCircle size={13} /> Consultar
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative bg-[var(--sf-card-bg)] border rounded-[var(--sf-radius-lg)] overflow-hidden cursor-pointer"
      style={{
        borderColor: hovered ? "var(--sf-border-strong)" : "var(--sf-border)",
        boxShadow: hovered
          ? "0 16px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)"
          : "0 1px 4px rgba(0,0,0,.04)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.3s ease",
      }}
      onClick={() => onSelect(product)}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <motion.img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 transition-opacity duration-300"
             style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)", opacity: hovered ? 1 : 0 }} />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)" }}>
            {product.category}
          </span>
        </div>

        {/* Tags */}
        {product.tags[0] && (
          <div className="absolute top-3 right-10">
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                  style={{ background: "var(--sf-accent)", color: "#0a0a0a" }}>
              {product.tags[0]}
            </span>
          </div>
        )}

        {/* Heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)" }}
        >
          <Heart size={14} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "#6b7280"} />
        </button>

        {/* Hover actions */}
        <motion.div
          className="absolute bottom-3 inset-x-3 flex gap-2"
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.18 }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(product); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.95)", color: "var(--sf-text)" }}
          >
            <Eye size={12} /> Ver detalle
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onWhatsApp(product); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white"
            style={{ background: "var(--sf-whatsapp)" }}
          >
            <MessageCircle size={12} /> Consultar
          </button>
        </motion.div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-semibold text-[var(--sf-text)] text-base leading-tight mb-3 line-clamp-2"
            style={{ fontFamily: "'Playfair Display', serif" }}>
          {product.title}
        </h3>

        {/* Dynamic spec pills */}
        {specPills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {specPills.map(({ label, value }) => (
              <span key={label} className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{ background: "var(--sf-page-bg-2)", color: "var(--sf-text-muted)", border: "1px solid var(--sf-border)" }}>
                <span className="text-[var(--sf-text-faint)]">{label}:</span> {value}
              </span>
            ))}
          </div>
        )}

        {/* Stock badge */}
        {product.stock <= 3 && product.stock > 0 && (
          <p className="text-[11px] font-semibold mb-3" style={{ color: "#f59e0b" }}>
            ⚠ Últimas {product.stock} unidades
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--sf-border)]">
          <div>
            <p className="text-[10px] text-[var(--sf-text-faint)] uppercase tracking-wider">Precio</p>
            <p className="text-xl font-bold text-[var(--sf-text)]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {fmt(product.price)}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onWhatsApp(product); }}
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white"
            style={{ background: "var(--sf-whatsapp)", boxShadow: "0 2px 10px rgba(37,211,102,0.3)" }}
          >
            <MessageCircle size={13} /> Consultar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Filter Section accordion ──────────────────────────────────────────────────
function FilterSection({ title, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--sf-border)] pb-4 mb-4 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-[var(--sf-text)] mb-3"
      >
        <span className="flex items-center gap-2">
          {title}
          {count != null && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "var(--sf-page-bg-2)", color: "var(--sf-text-faint)" }}>
              {count}
            </span>
          )}
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Price Range ───────────────────────────────────────────────────────────────
function PriceRange({ min, max, value, onChange }) {
  const range = max - min || 1;
  const step  = max > 100_000 ? 1000 : max > 10_000 ? 500 : 100;

  return (
    <div>
      <div className="flex justify-between text-xs text-[var(--sf-text-muted)] mb-3">
        <span className="font-medium">{fmtShort(value[0])}</span>
        <span className="font-medium">{fmtShort(value[1])}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-1 rounded-full" style={{ background: "var(--sf-border)" }} />
        <div className="absolute h-1 rounded-full" style={{
          left:  `${((value[0] - min) / range) * 100}%`,
          right: `${100 - ((value[1] - min) / range) * 100}%`,
          background: "var(--sf-accent)",
        }} />
        {[0, 1].map((i) => (
          <input
            key={i}
            type="range"
            min={min} max={max} step={step}
            value={value[i]}
            onChange={(e) => {
              const next = [...value];
              next[i] = Number(e.target.value);
              if (i === 0 && next[0] < next[1]) onChange(next);
              if (i === 1 && next[1] > next[0]) onChange(next);
            }}
            className="absolute inset-x-0 w-full opacity-0 cursor-pointer h-5"
          />
        ))}
      </div>
    </div>
  );
}

// ─── Dynamic filter options derived from specs ─────────────────────────────────
function useFilterOptions(products) {
  return useMemo(() => {
    const categories = new Set();
    const specOptions = {}; // specKey -> Set of values

    products.forEach((p) => {
      if (p.category) categories.add(p.category);
      Object.entries(p.specs || {}).forEach(([k, v]) => {
        if (v === null || v === undefined || v === "" || typeof v === "boolean") return;
        if (!specOptions[k]) specOptions[k] = new Set();
        specOptions[k].add(String(v));
      });
    });

    // Only expose spec filters that have ≥2 distinct values and ≤12 options (enums)
    const enumSpecs = Object.entries(specOptions)
      .filter(([, vals]) => vals.size >= 2 && vals.size <= 12)
      .map(([key, vals]) => ({ key, values: ["Todos", ...Array.from(vals).sort()] }));

    const prices = products.map((p) => p.price).filter((p) => p > 0);
    const priceMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
    const priceMax = prices.length ? Math.ceil(Math.max(...prices)) : 100_000;

    return {
      categories: ["Todos", ...Array.from(categories).sort()],
      enumSpecs,
      priceMin,
      priceMax,
    };
  }, [products]);
}

// ─── Main Catalog Page ─────────────────────────────────────────────────────────
export default function CatalogPage({ initialSearch, onSelectProduct }) {
  const [search, setSearch]             = useState(initialSearch?.query || "");
  const [category, setCategory]         = useState("Todos");
  const [specFilters, setSpecFilters]   = useState({});   // { specKey: "value" | "Todos" }
  const [priceRange, setPriceRange]     = useState(null); // set once products load
  const [sort, setSort]                 = useState("default");
  const [viewMode, setViewMode]         = useState("grid");
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [whatsappProduct, setWhatsappProduct] = useState(null);

  // ── Backend data ──
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    fetchProductos()
      .then((prods) => {
        setAllProducts(prods);
        if (prods.length) {
          const prices = prods.map((p) => p.price).filter((p) => p > 0);
          const min    = Math.floor(Math.min(...prices));
          const max    = Math.ceil(Math.max(...prices));
          setPriceRange([min, max]);
        }
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  // ── Filter options derived from ALL products ──
  const { categories, enumSpecs, priceMin, priceMax } = useFilterOptions(allProducts);

  // Init price range once we know min/max
  const activePriceRange = priceRange || [priceMin, priceMax];

  // ── When category changes, reset spec filters ──
  const handleCategoryChange = useCallback((cat) => {
    setCategory(cat);
    setSpecFilters({});
  }, []);

  // ── Apply all filters ──
  const filtered = useMemo(() => {
    if (!priceRange) return [];
    let list = [...allProducts];

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        Object.values(p.specs || {}).some((v) => String(v).toLowerCase().includes(q))
      );
    }

    // Category
    if (category !== "Todos") list = list.filter((p) => p.category === category);

    // Price range
    list = list.filter((p) => p.price >= activePriceRange[0] && p.price <= activePriceRange[1]);

    // Dynamic spec filters
    Object.entries(specFilters).forEach(([key, val]) => {
      if (!val || val === "Todos") return;
      list = list.filter((p) => String(p.specs?.[key] ?? "") === val);
    });

    // Sort
    switch (sort) {
      case "price_asc":  list.sort((a, b) => a.price - b.price); break;
      case "price_desc": list.sort((a, b) => b.price - a.price); break;
      case "name_asc":   list.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: break; // keep backend order
    }

    return list;
  }, [allProducts, search, category, activePriceRange, specFilters, sort, priceRange]);

  // ── Active filter count for badge ──
  const activeCount = [
    category !== "Todos",
    priceRange && (priceRange[0] > priceMin || priceRange[1] < priceMax),
    ...Object.values(specFilters).map((v) => v && v !== "Todos"),
  ].filter(Boolean).length;

  const resetFilters = useCallback(() => {
    setCategory("Todos");
    setSpecFilters({});
    setPriceRange([priceMin, priceMax]);
  }, [priceMin, priceMax]);

  return (
    <div style={{ background: "var(--sf-page-bg)", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>

      {/* ── Top Bar ── */}
      <div
        className="sticky top-[60px] z-40 px-4 py-3 flex items-center gap-3"
        style={{ background: "rgba(250,250,249,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--sf-border)" }}
      >
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sf-text-faint)]" />
          <input
            type="text"
            placeholder="Buscar en el catálogo…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-[var(--sf-border)] bg-white outline-none transition-colors"
            style={{ color: "var(--sf-text)" }}
            onFocus={(e) => e.target.style.borderColor = "var(--sf-accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--sf-border)"}
          />
        </div>

        {/* Filtros toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="relative flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all flex-shrink-0"
          style={{
            borderColor: activeCount > 0 ? "var(--sf-accent)" : "var(--sf-border)",
            background:  activeCount > 0 ? "var(--sf-accent-light)" : "white",
            color:       activeCount > 0 ? "var(--sf-accent)" : "var(--sf-text-muted)",
          }}
        >
          <SlidersHorizontal size={14} />
          <span className="hidden sm:inline">Filtros</span>
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: "var(--sf-accent-dark)" }}>
              {activeCount}
            </span>
          )}
        </button>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-[var(--sf-border)] text-sm bg-white outline-none hidden sm:block flex-shrink-0"
          style={{ color: "var(--sf-text)" }}
        >
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* View toggle */}
        <div className="flex border border-[var(--sf-border)] rounded-xl overflow-hidden flex-shrink-0">
          {[["grid", Grid3X3], ["list", List]].map(([mode, Icon]) => (
            <button key={mode} onClick={() => setViewMode(mode)} className="p-2.5 transition-colors"
                    style={{ background: viewMode === mode ? "var(--sf-accent-light)" : "white",
                             color: viewMode === mode ? "var(--sf-accent-dark)" : "var(--sf-text-faint)" }}>
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex max-w-screen-xl mx-auto px-4 py-6 gap-6">

        {/* ── Sidebar — 100% dinámico ── */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 272, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="w-[272px]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-[var(--sf-text)]">Filtros</h2>
                  {activeCount > 0 && (
                    <button onClick={resetFilters}
                            className="text-xs flex items-center gap-1 font-medium hover:underline"
                            style={{ color: "var(--sf-accent)" }}>
                      <X size={10} /> Limpiar todo
                    </button>
                  )}
                </div>

                {/* ── Categoría — viene del backend ── */}
                <FilterSection title="Categoría" count={categories.length - 1}>
                  <div className="flex flex-col gap-0.5">
                    {categories.map((cat) => {
                      const count = cat === "Todos"
                        ? allProducts.length
                        : allProducts.filter((p) => p.category === cat).length;
                      return (
                        <button
                          key={cat}
                          onClick={() => handleCategoryChange(cat)}
                          className="flex items-center justify-between text-left text-sm px-3 py-2 rounded-lg transition-all"
                          style={{
                            background: category === cat ? "var(--sf-accent-light)" : "transparent",
                            color:      category === cat ? "var(--sf-accent-dark)"  : "var(--sf-text-muted)",
                            fontWeight: category === cat ? 600 : 400,
                          }}
                        >
                          <span>{cat}</span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0"
                                style={{ background: "var(--sf-page-bg-2)", color: "var(--sf-text-faint)" }}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>

                {/* ── Precio — range dinámico basado en los datos reales ── */}
                {priceMin < priceMax && (
                  <FilterSection title="Precio">
                    <PriceRange
                      min={priceMin}
                      max={priceMax}
                      value={activePriceRange}
                      onChange={setPriceRange}
                    />
                    <p className="text-[10px] text-[var(--sf-text-faint)] mt-2 text-center">
                      {fmtShort(priceMin)} — {fmtShort(priceMax)}
                    </p>
                  </FilterSection>
                )}

                {/* ── Filtros de specs — solo si existen en los datos ── */}
                {enumSpecs
                  .filter(({ key }) => {
                    // Solo mostrar specs que existan en los productos de la categoría activa
                    const scope = category === "Todos"
                      ? allProducts
                      : allProducts.filter((p) => p.category === category);
                    return scope.some((p) => p.specs?.[key] != null && p.specs[key] !== "");
                  })
                  .map(({ key, values }) => {
                    const label = allProducts.find((p) => p.specLabels?.[key])?.[`specLabels`]?.[key]
                      || key.charAt(0).toUpperCase() + key.slice(1);
                    const current = specFilters[key] || "Todos";

                    return (
                      <FilterSection key={key} title={label}>
                        <div className="flex flex-col gap-0.5">
                          {values.map((val) => (
                            <button
                              key={val}
                              onClick={() =>
                                setSpecFilters((prev) => ({ ...prev, [key]: val }))
                              }
                              className="text-left text-sm px-3 py-2 rounded-lg transition-all"
                              style={{
                                background: current === val ? "var(--sf-accent-light)" : "transparent",
                                color:      current === val ? "var(--sf-accent-dark)"  : "var(--sf-text-muted)",
                                fontWeight: current === val ? 600 : 400,
                              }}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </FilterSection>
                    );
                  })}

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Product Grid ── */}
        <div className="flex-1 min-w-0">

          {loading && (
            <div className="flex flex-col items-center justify-center py-28">
              <Loader2 size={32} className="animate-spin mb-3" style={{ color: "var(--sf-accent)" }} />
              <p className="text-sm text-[var(--sf-text-muted)]">Cargando productos…</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <AlertCircle size={36} className="mb-3" style={{ color: "#ef4444" }} />
              <p className="font-semibold text-[var(--sf-text)] mb-1">No se pudieron cargar los productos</p>
              <p className="text-sm text-[var(--sf-text-muted)] mb-3 max-w-xs">{error}</p>
              <p className="text-xs text-[var(--sf-text-faint)]">
                Verificá que el backend esté corriendo en <code>localhost:3001</code>
              </p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Result header */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-[var(--sf-text-muted)]">
                  <span className="font-semibold text-[var(--sf-text)]">{filtered.length}</span>
                  {" "}producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                  {category !== "Todos" && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                          style={{ background: "var(--sf-accent-light)", color: "var(--sf-accent-dark)" }}>
                      <Tag size={10} /> {category}
                    </span>
                  )}
                </p>
              </div>

              <LayoutGroup>
                <AnimatePresence mode="popLayout">
                  {filtered.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-24 text-center"
                    >
                      <Search size={40} className="mb-4" style={{ color: "var(--sf-border-strong)" }} />
                      <h3 className="font-semibold text-[var(--sf-text)] mb-2">Sin resultados</h3>
                      <p className="text-sm text-[var(--sf-text-muted)] mb-4">
                        Probá con otros filtros o términos de búsqueda.
                      </p>
                      <button onClick={resetFilters} className="text-sm font-semibold hover:underline"
                              style={{ color: "var(--sf-accent)" }}>
                        Limpiar filtros
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="grid"
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                          : "flex flex-col gap-3"
                      }
                    >
                      {filtered.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          viewMode={viewMode}
                          onSelect={onSelectProduct}
                          onWhatsApp={setWhatsappProduct}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </LayoutGroup>
            </>
          )}
        </div>
      </div>

      {whatsappProduct && (
        <WhatsAppBridge product={whatsappProduct} onClose={() => setWhatsappProduct(null)} />
      )}
    </div>
  );
}
