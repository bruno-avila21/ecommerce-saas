import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Search, Shield, CreditCard, Headphones,
  ArrowRight, MessageCircle,
} from "lucide-react";
import { BRAND, HIGHLIGHTS } from "../config/storefrontConfig";
import AutocityHero from "../componentes/storefront/AutocityHero";
import StoreLocator from "../componentes/storefront/StoreLocator";
import SocialProof from "../componentes/storefront/SocialProof";
import Footer from "../componentes/storefront/Footer";

// ─── Search Bar ────────────────────────────────────────────────────────────────
const MARCAS = [
  "Alfa Romeo","Audi","BYD","Chevrolet","Citroën","Fiat","Ford",
  "Honda","Hyundai","Jeep","Kia","Mazda","Mercedes-Benz","Nissan",
  "Peugeot","Renault","Suzuki","Toyota","Volkswagen",
];

function SearchBar({ onSearch }) {
  const [tab,    setTab]    = useState("0km");
  const [marca,  setMarca]  = useState("");
  const [modelo, setModelo] = useState("");
  const [version,setVersion]= useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({ tipo: tab, marca, modelo, version });
  };

  // Chevron blanco para los selects oscuros
  const chevronWhite = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='rgba(255,255,255,0.5)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")";

  const selectStyle = {
    flex: 1,
    minWidth: 0,
    padding: "0 14px",
    height: 48,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "var(--sf-radius-sm)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.85)",
    fontSize: "0.875rem",
    fontFamily: "'DM Sans', sans-serif",
    appearance: "none",
    backgroundImage: chevronWhite,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 32,
    cursor: "pointer",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "rgba(3,8,20,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "var(--sf-radius-lg)",
        padding: "28px 28px 24px",
        maxWidth: 860,
        margin: "0 auto",
        position: "relative",
        zIndex: 10,
        marginTop: -40,
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {["0km", "Usados"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "7px 20px",
              borderRadius: "var(--sf-radius-sm)",
              border: "none",
              fontSize: "0.82rem",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "background 0.2s, color 0.2s",
              background: tab === t ? "var(--sf-accent)" : "rgba(255,255,255,0.07)",
              color:      tab === t ? "#0a0a0a"           : "rgba(255,255,255,0.55)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Selects + botón */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            value={marca}
            onChange={(e) => { setMarca(e.target.value); setModelo(""); setVersion(""); }}
            style={selectStyle}
            onFocus={(e)  => (e.target.style.borderColor = "var(--sf-accent)")}
            onBlur={(e)   => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          >
            <option value="" style={{ background: "#030814" }}>Marca</option>
            {MARCAS.map((m) => <option key={m} value={m} style={{ background: "#030814" }}>{m}</option>)}
          </select>

          <select
            value={modelo}
            onChange={(e) => { setModelo(e.target.value); setVersion(""); }}
            disabled={!marca}
            style={{ ...selectStyle, opacity: marca ? 1 : 0.45 }}
            onFocus={(e)  => (e.target.style.borderColor = "var(--sf-accent)")}
            onBlur={(e)   => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          >
            <option value="" style={{ background: "#030814" }}>Modelo</option>
          </select>

          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            disabled={!modelo}
            style={{ ...selectStyle, opacity: modelo ? 1 : 0.45 }}
            onFocus={(e)  => (e.target.style.borderColor = "var(--sf-accent)")}
            onBlur={(e)   => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          >
            <option value="" style={{ background: "#030814" }}>Versión</option>
          </select>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              height: 48,
              padding: "0 28px",
              borderRadius: "var(--sf-radius-sm)",
              border: "none",
              background: "var(--sf-accent)",
              color: "#0a0a0a",
              fontWeight: 700,
              fontSize: "0.875rem",
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}
          >
            Buscar
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

// ─── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 55, damping: 18 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const parsed = parseInt(String(target).replace(/\D/g, ""), 10);
    if (isInView && !isNaN(parsed)) motionVal.set(parsed);
  }, [isInView, target, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => {
      const parsed = parseInt(String(target).replace(/\D/g, ""), 10);
      setDisplay(isNaN(parsed) ? String(target) : Math.round(v).toString());
    });
  }, [spring, target]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

// ─── Highlight Card ────────────────────────────────────────────────────────────
const ICON_MAP = { Shield, CreditCard, Headphones };

function HighlightCard({ item, index }) {
  const Icon = ICON_MAP[item.icon] || Shield;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group relative bg-white border border-[var(--sf-border)] rounded-[var(--sf-radius-lg)] p-7 overflow-hidden cursor-default"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.04)" }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(ellipse at top left, var(--sf-accent-light) 0%, transparent 70%)" }}
      />
      <div className="relative z-10">
        <div
          className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5"
          style={{ background: "var(--sf-accent-light)", color: "var(--sf-accent-dark)" }}
        >
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <div className="mb-3">
          <span className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "var(--sf-accent)" }}>
            <AnimatedCounter target={item.stat} />
          </span>
          <p className="text-[10px] font-bold text-[var(--sf-text-muted)] uppercase tracking-widest mt-0.5">{item.statLabel}</p>
        </div>
        <h3 className="text-base font-semibold text-[var(--sf-text)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
        <p className="text-sm text-[var(--sf-text-muted)] leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage({ onSearch, onNavigateCatalog }) {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ query });
    if (onNavigateCatalog) onNavigateCatalog({ query });
  };

  const handleNavigate = (route) => {
    if (route === "catalog" && onNavigateCatalog) onNavigateCatalog();
  };

  return (
    <div style={{ background: "var(--sf-page-bg)", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HERO CAROUSEL ──────────────────────────────────────────── */}
      <AutocityHero onNavigate={handleNavigate} />

      {/* ── SEARCH BAR (flota sobre el hero, fondo continuo) ──────── */}
      <div style={{
        background: "linear-gradient(to bottom, #040912 0%, #040912 50%, var(--sf-page-bg) 100%)",
        paddingBottom: 32,
      }}>
        <div className="max-w-screen-xl mx-auto px-4">
          <SearchBar onSearch={(params) => { if (onSearch) onSearch(params); if (onNavigateCatalog) onNavigateCatalog(params); }} />
        </div>
      </div>

      {/* ── QUICK LINKS BAR ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-b border-[var(--sf-border)]"
        style={{ background: "var(--sf-card-bg)", marginTop: 24 }}
      >
        <div className="max-w-screen-xl mx-auto px-4 flex overflow-x-auto">
          {[
            { label: "⚡ 0km", sub: "Nuevos 2024-2025" },
            { label: "🔑 Usados", sub: "Desde $8.000" },
            { label: "💳 Financiación", sub: "60 cuotas" },
            { label: "🔄 Permuta", sub: "Tasación gratis" },
            { label: "🛡️ Seguros", sub: "Al mejor precio" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => item.label.includes("Usad") && onNavigateCatalog()}
              className="flex-shrink-0 flex flex-col items-center px-6 py-4 border-r border-[var(--sf-border)] last:border-r-0 hover:bg-[var(--sf-page-bg)] transition-colors group"
            >
              <span className="font-semibold text-sm text-[var(--sf-text)] group-hover:text-[var(--sf-accent)] transition-colors">{item.label}</span>
              <span className="text-[11px] text-[var(--sf-text-faint)] mt-0.5">{item.sub}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── HIGHLIGHTS ─────────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: "var(--sf-page-bg)" }}>
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--sf-accent)" }}>
              Por qué elegirnos
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[var(--sf-text)] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Comprá con total confianza
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HIGHLIGHTS.map((item, i) => <HighlightCard key={item.title} item={item} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── FEATURED STRIP ─────────────────────────────────────────── */}
      <section
        className="py-14 px-4"
        style={{ background: "var(--sf-hero-bg)" }}
      >
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Más de 200 opciones disponibles.
            </h3>
            <p className="text-slate-400 text-sm">Actualizamos el catálogo todos los días con las mejores oportunidades.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNavigateCatalog}
            className="flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap"
            style={{ background: "var(--sf-accent)", color: "#0a0a0a", boxShadow: "0 4px 20px rgba(201,168,76,0.35)" }}
          >
            Ver catálogo completo
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </section>

      <StoreLocator />
      <SocialProof />
      <Footer onNavigateCatalog={onNavigateCatalog} />
    </div>
  );
}
