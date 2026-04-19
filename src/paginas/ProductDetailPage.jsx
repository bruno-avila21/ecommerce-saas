import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Share2, Heart, MessageCircle,
  Phone, MapPin, CheckCircle2, Eye, Maximize2, X, Loader2,
} from "lucide-react";
import WhatsAppBridge from "../componentes/storefront/WhatsAppBridge";
import { BRAND } from "../config/storefrontConfig";
import { fetchProducto, fetchImagenesProducto } from "../servicios/api";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (v) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(v);

// ─── Image Gallery ─────────────────────────────────────────────────────────────
function Gallery({ images, title }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setActiveIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx(i => (i + 1) % images.length);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox]);

  if (!images.length) return null;

  return (
    <>
      <div
        className="relative rounded-[var(--sf-radius-lg)] overflow-hidden bg-slate-100 aspect-[4/3] cursor-zoom-in group"
        onClick={() => setLightbox(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={images[activeIdx]}
            alt={`${title} - imagen ${activeIdx + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)" }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)" }}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        <div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(255,255,255,0.9)" }}
        >
          <Maximize2 size={14} className="text-slate-700" />
        </div>

        <div
          className="absolute bottom-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.5)", color: "white" }}
        >
          {activeIdx + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all"
              style={{ borderColor: i === activeIdx ? "var(--sf-accent)" : "transparent" }}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.95)" }}
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={() => setLightbox(false)}
            >
              <X size={18} className="text-white" />
            </button>
            <motion.img
              key={activeIdx}
              src={images[activeIdx]}
              alt={title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Dynamic Spec Table ─────────────────────────────────────────────────────────
function SpecTable({ specs, labels = {} }) {
  const entries = Object.entries(specs).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  if (!entries.length) return null;

  return (
    <div className="rounded-[var(--sf-radius)] overflow-hidden border border-[var(--sf-border)]">
      {entries.map(([key, value], i) => (
        <div
          key={key}
          className="flex items-center px-4 py-3"
          style={{
            background: i % 2 === 0 ? "var(--sf-page-bg)" : "var(--sf-card-bg)",
            borderBottom: i < entries.length - 1 ? "1px solid var(--sf-border)" : "none",
          }}
        >
          <span className="text-sm text-[var(--sf-text-muted)] w-1/2 flex-shrink-0 capitalize">
            {labels[key] || key}
          </span>
          <span className="text-sm font-medium text-[var(--sf-text)]">
            {typeof value === "boolean" ? (value ? "Sí" : "No") : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Product Detail Page ──────────────────────────────────────────────────
export default function ProductDetailPage({ product: initialProduct, onBack }) {
  const [product, setProduct] = useState(initialProduct);
  const [images, setImages] = useState(initialProduct?.images || []);
  const [loading, setLoading] = useState(!initialProduct);
  const [liked, setLiked] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");

  // Re-fetch full product details + images from backend
  useEffect(() => {
    if (!initialProduct?.id) return;

    // Fetch gallery images in the background
    fetchImagenesProducto(initialProduct.id).then((imgs) => {
      if (imgs.length > 0) {
        setImages(imgs.map((img) => img.url));
      }
    }).catch(() => {});

    // Optionally re-fetch full product in case the catalog data is incomplete
    fetchProducto(initialProduct.id).then((p) => {
      if (p) setProduct(p);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [initialProduct?.id]);

  if (loading && !product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--sf-page-bg)" }}
      >
        <Loader2 size={32} className="animate-spin" style={{ color: "var(--sf-accent)" }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "var(--sf-page-bg)" }}
      >
        <p className="text-[var(--sf-text-muted)]">Producto no encontrado.</p>
        <button onClick={onBack} className="text-[var(--sf-accent)] underline text-sm">
          Volver al catálogo
        </button>
      </div>
    );
  }

  // Build spec entries, excluding 'descripcion' (shown in the description tab)
  const specsForTable = Object.fromEntries(
    Object.entries(product.specs || {}).filter(
      ([k, v]) => k !== "descripcion" && v !== null && v !== undefined && v !== ""
    )
  );

  const description = product.description || product.specs?.descripcion || "";

  // Top 3–4 quick pills for the sidebar (any non-empty spec)
  const quickSpecs = Object.entries(product.specs || {})
    .filter(([k, v]) => k !== "descripcion" && v !== null && v !== undefined && v !== "")
    .slice(0, 4);

  return (
    <div style={{ background: "var(--sf-page-bg)", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
      {/* ── Breadcrumb ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-[var(--sf-text-muted)]">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-[var(--sf-text)] transition-colors"
          >
            <ChevronLeft size={14} /> Volver al catálogo
          </button>
          <span>/</span>
          <span className="text-[var(--sf-text)] font-medium truncate">{product.title}</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* ── Left Column ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Gallery images={images} title={product.title} />
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8"
            >
              <div className="flex border-b border-[var(--sf-border)] mb-6 gap-1">
                {[
                  ["specs", "Especificaciones"],
                  ...(description ? [["description", "Descripción"]] : []),
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className="px-5 py-3 text-sm font-medium transition-all relative"
                    style={{ color: activeTab === id ? "var(--sf-text)" : "var(--sf-text-muted)" }}
                  >
                    {label}
                    {activeTab === id && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute bottom-0 inset-x-0 h-0.5 rounded-full"
                        style={{ background: "var(--sf-accent)" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {Object.keys(specsForTable).length > 0 ? (
                      <>
                        <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--sf-text-muted)] mb-3">
                          Información del producto
                        </h4>
                        <SpecTable
                          specs={specsForTable}
                          labels={product.specLabels || {}}
                        />
                      </>
                    ) : (
                      <p className="text-sm text-[var(--sf-text-muted)]">
                        No hay especificaciones disponibles.
                      </p>
                    )}
                  </motion.div>
                )}

                {activeTab === "description" && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[var(--sf-text-muted)] leading-relaxed text-base whitespace-pre-line">
                      {description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Right Column (Sticky Sidebar) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* Main info card */}
              <div
                className="rounded-[var(--sf-radius-lg)] border border-[var(--sf-border)] p-6"
                style={{ background: "var(--sf-card-bg)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
              >
                {/* Tags */}
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                        style={{ background: "var(--sf-accent-light)", color: "var(--sf-accent-dark)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Category badge */}
                {product.category && (
                  <div className="mb-2">
                    <span className="text-xs text-[var(--sf-text-muted)] font-medium uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1
                  className="text-2xl font-bold text-[var(--sf-text)] leading-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {product.title}
                </h1>

                {/* Quick spec pills (dynamic) */}
                {quickSpecs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6 text-xs text-[var(--sf-text-muted)]">
                    {quickSpecs.map(([k, v]) => (
                      <span key={k} className="flex items-center gap-1">
                        <MapPin size={10} />
                        <span className="capitalize">{product.specLabels?.[k] || k}:</span>
                        <strong>{String(v)}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-[var(--sf-border)]">
                  <p className="text-xs text-[var(--sf-text-faint)] uppercase tracking-wider mb-1">Precio</p>
                  <p
                    className="text-4xl font-bold text-[var(--sf-text)]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {fmt(product.price)}
                  </p>
                  {product.stock > 0 && product.stock <= 5 && (
                    <p className="text-xs mt-1" style={{ color: "var(--sf-accent)" }}>
                      ¡Solo {product.stock} unidad{product.stock > 1 ? "es" : ""} disponible!
                    </p>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setWhatsappOpen(true)}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base text-white transition-all"
                    style={{
                      background: "var(--sf-whatsapp)",
                      boxShadow: "0 4px 24px rgba(37,211,102,0.35)",
                    }}
                  >
                    <MessageCircle size={20} />
                    Consultar por WhatsApp
                  </motion.button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${BRAND.whatsapp}`}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border border-[var(--sf-border)] hover:border-[var(--sf-border-strong)] transition-all"
                      style={{ color: "var(--sf-text)" }}
                    >
                      <Phone size={15} /> Llamar
                    </a>
                    <button
                      onClick={() => setLiked(!liked)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border transition-all"
                      style={{
                        borderColor: liked ? "#fecaca" : "var(--sf-border)",
                        background: liked ? "#fef2f2" : "transparent",
                        color: liked ? "#ef4444" : "var(--sf-text-muted)",
                      }}
                    >
                      <Heart size={15} fill={liked ? "#ef4444" : "none"} />
                      {liked ? "Guardado" : "Guardar"}
                    </button>
                  </div>

                  <button
                    onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] transition-colors"
                  >
                    <Share2 size={14} /> Compartir este aviso
                  </button>
                </div>
              </div>

              {/* Views badge */}
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--sf-border)]"
                style={{ background: "var(--sf-page-bg-2)" }}
              >
                <Eye size={15} style={{ color: "var(--sf-accent)" }} />
                <span className="text-xs text-[var(--sf-text-muted)]">
                  <strong className="text-[var(--sf-text)]">47 personas</strong> vieron este aviso hoy
                </span>
              </div>

              {/* Seller card */}
              <div
                className="rounded-[var(--sf-radius-lg)] border border-[var(--sf-border)] p-5"
                style={{ background: "var(--sf-card-bg)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: "var(--sf-accent)", color: "#0a0a0a" }}
                  >
                    {BRAND.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[var(--sf-text)]">{BRAND.name}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-[10px]" style={{ color: "var(--sf-accent)" }}>★</span>
                      ))}
                      <span className="text-[10px] text-[var(--sf-text-muted)] ml-1">Vendedor verificado</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[var(--sf-text-muted)]">
                  Respondemos en menos de 30 minutos durante el horario de atención.
                </p>
              </div>

              {/* Provider info (if available) */}
              {product.provider && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--sf-border)]"
                     style={{ background: "var(--sf-page-bg-2)" }}>
                  <CheckCircle2 size={15} style={{ color: "var(--sf-accent)" }} />
                  <span className="text-xs text-[var(--sf-text-muted)]">
                    Proveedor: <strong className="text-[var(--sf-text)]">{product.provider}</strong>
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* WhatsApp Bridge Modal */}
      <AnimatePresence>
        {whatsappOpen && (
          <WhatsAppBridge
            product={product}
            onClose={() => setWhatsappOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
