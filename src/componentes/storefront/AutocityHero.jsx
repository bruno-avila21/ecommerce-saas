/**
 * AutocityHero — Hero carousel de pantalla completa para la landing del storefront.
 * NO incluye navbar (se monta externamente en App.jsx).
 *
 * Props:
 *   onNavigate(route: string) — callback para navegar entre páginas
 *   slides?: array — override de los slides por defecto
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_SLIDES = [
  {
    id: 1,
    badge: "Nuevo · 2024",
    title: ["Encontrá tu", "próximo vehículo"],
    accent: "con nosotros",
    description: "Los mejores 0km y usados seleccionados para vos",
    cta: "Explorar catálogo",
    ctaRoute: "catalog",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1920&q=80",
  },
  {
    id: 2,
    badge: "Financiación · Flexible",
    title: ["Financiación propia,", "sin banco,"],
    accent: "sin vueltas",
    description: "Hasta 60 cuotas fijas. Aprobación en 24 horas.",
    cta: "Conocer planes",
    ctaRoute: null,
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=80",
  },
  {
    id: 3,
    badge: "Permuta · Tasación gratis",
    title: ["Vendé o permutá", "tu auto"],
    accent: "sin complicaciones",
    description: "Tasación gratuita y resultado inmediato en minutos.",
    cta: "Tasar mi auto",
    ctaRoute: null,
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1920&q=80",
  },
  {
    id: 4,
    badge: "Usados · Certificados",
    title: ["Tu auto ideal", "te espera"],
    accent: "entre usados garantizados",
    description: "Vehículos revisados con garantía escrita y financiación.",
    cta: "Ver usados",
    ctaRoute: "catalog",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
  },
  {
    id: 5,
    badge: "Servicio · Oficial",
    title: ["Posventa", "certificado"],
    accent: "taller especializado",
    description: "Técnicos certificados y repuestos originales garantizados.",
    cta: "Sacar turno",
    ctaRoute: null,
    image:
      "https://images.unsplash.com/photo-1633158829799-96bb13cab779?w=1920&q=80",
  },
];

const AUTOPLAY_MS = 6500;

export default function AutocityHero({ onNavigate, slides = DEFAULT_SLIDES }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState(null);
  const [busy, setBusy]       = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const timerRef = useRef(null);

  /* ── Navegación ───────────────────────────────────────────────────────── */
  const goTo = useCallback(
    (index) => {
      if (index === current || busy) return;
      setBusy(true);
      setPrev(current);
      setCurrent(index);
      setContentKey((k) => k + 1);
      setTimeout(() => {
        setPrev(null);
        setBusy(false);
      }, 900);
    },
    [current, busy]
  );

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((c) => {
        const next = (c + 1) % slides.length;
        goTo(next);
        return c; // goTo manejará el cambio
      }),
      AUTOPLAY_MS
    );
  }, [goTo, slides.length]);

  /* Autoplay */
  useEffect(() => {
    const id = setInterval(
      () => goTo((current + 1) % slides.length),
      AUTOPLAY_MS
    );
    return () => clearInterval(id);
  }, [current, goTo, slides.length]);

  /* Teclas de flecha */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo((current + 1) % slides.length);
      if (e.key === "ArrowLeft")  goTo((current - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, slides.length]);

  const slide = slides[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300&family=Barlow:wght@300;400;500&display=swap');

        .ach-root  { font-family: 'Barlow', sans-serif; }
        .ach-cond  { font-family: 'Barlow Condensed', sans-serif; }

        /* Fondo cross-fade */
        .ach-bg {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center 28%;
          transition: opacity 0.95s cubic-bezier(0.4,0,0.2,1);
          will-change: opacity;
        }

        /* Ghost CTA */
        .ach-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.17em;
          text-transform: uppercase;
          color: white;
          border: 1.5px solid rgba(255,255,255,0.72);
          padding: 14px 34px;
          background: transparent;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.38s, border-color 0.38s;
          display: inline-block;
        }
        .ach-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: white;
          transform: translateX(-101%);
          transition: transform 0.38s cubic-bezier(0.4,0,0.2,1);
        }
        .ach-btn:hover { color: #040912; border-color: white; }
        .ach-btn:hover::before { transform: translateX(0); }
        .ach-btn-label { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; }

        /* Barra de progreso en dot activo */
        @keyframes ach-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .ach-bar {
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.9);
          transform-origin: left center;
          animation: ach-progress ${AUTOPLAY_MS}ms linear forwards;
          border-radius: 99px;
        }
      `}</style>

      <section
        className="ach-root relative overflow-hidden"
        style={{ height: "100svh", minHeight: 580, background: "#040912" }}
        aria-label="Hero carousel"
      >
        {/* ── Imágenes cross-fade ─────────────────────────────────────────── */}
        {prev !== null && (
          <div
            className="ach-bg"
            style={{
              backgroundImage: `url(${slides[prev].image})`,
              opacity: 0,
            }}
          />
        )}
        <div
          key={current}
          className="ach-bg"
          style={{
            backgroundImage: `url(${slide.image})`,
            opacity: 1,
          }}
        />

        {/* ── Gradientes de legibilidad ────────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: [
              "linear-gradient(100deg, rgba(4,9,18,0.93) 0%, rgba(4,9,18,0.76) 28%, rgba(4,9,18,0.32) 52%, rgba(4,9,18,0.04) 70%, transparent 84%)",
              "linear-gradient(to top, rgba(4,9,18,0.6) 0%, rgba(4,9,18,0.08) 18%, transparent 35%)",
            ].join(", "),
          }}
        />

        {/* ── Contenido (re-monta en cada slide para reiniciar animaciones) ─── */}
        <div
          className="absolute inset-0 flex flex-col justify-center"
          style={{ padding: "0 clamp(20px, 5vw, 96px)", paddingTop: 60 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Eyebrow */}
              <motion.span
                className="ach-cond"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.22,0.61,0.36,1] }}
                style={{
                  color: "rgba(168,204,248,0.78)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 16,
                }}
              >
                {slide.badge}
              </motion.span>

              {/* Título */}
              <motion.h1
                className="ach-cond"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22, ease: [0.22,0.61,0.36,1] }}
                style={{
                  color: "white",
                  fontSize: "clamp(3rem, 6.8vw, 6rem)",
                  fontWeight: 800,
                  lineHeight: 0.96,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                {slide.title.map((line, i) => (
                  <span key={i} style={{ display: "block" }}>{line}</span>
                ))}
                <span
                  className="ach-cond"
                  style={{
                    display: "block",
                    color: "rgba(168,204,248,0.88)",
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: "0.68em",
                    letterSpacing: "0.05em",
                    textTransform: "none",
                    marginTop: 4,
                  }}
                >
                  {slide.accent}
                </span>
              </motion.h1>

              {/* Descripción */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.36, ease: [0.22,0.61,0.36,1] }}
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "clamp(0.88rem, 1.3vw, 1rem)",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  lineHeight: 1.6,
                  margin: "22px 0 30px",
                }}
              >
                {slide.description}
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: [0.22,0.61,0.36,1] }}
              >
                <button
                  className="ach-btn"
                  onClick={() => slide.ctaRoute && onNavigate(slide.ctaRoute)}
                >
                  <span className="ach-btn-label">
                    {slide.cta}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer del hero: dots (izq) + contador (der) ──────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-end justify-between"
          style={{ padding: "0 clamp(20px, 5vw, 96px) 32px" }}
        >
          {/* Pill indicators — alineados a la izquierda */}
          <div role="tablist" aria-label="Slides" style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === current}
                aria-label={`Ir al slide ${i + 1}`}
                onClick={() => goTo(i)}
                style={{
                  position: "relative",
                  height: 3,
                  width: i === current ? 40 : 8,
                  borderRadius: 99,
                  background: i === current
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.28)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {i === current && <span key={contentKey} className="ach-bar" />}
              </button>
            ))}
          </div>

          {/* Contador 01 — 05 */}
          <span
            className="ach-cond"
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", letterSpacing: "0.18em" }}
          >
            <span style={{ color: "rgba(255,255,255,0.88)" }}>0{current + 1}</span>
            <span style={{ margin: "0 8px", opacity: 0.4 }}>—</span>
            <span>0{slides.length}</span>
          </span>
        </div>
      </section>
    </>
  );
}
