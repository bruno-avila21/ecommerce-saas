import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { useStoreConfig } from "../../contextos/StoreConfigContext";

const NAV_HEIGHT = 70;

export default function Navbar({ onNavigate, currentPage }) {
  const { brand, navItems } = useStoreConfig();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isHeroPage = currentPage === "landing";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500&display=swap');

        .acnav-brand { font-family: 'Barlow Condensed', sans-serif; }
        .acnav-body  { font-family: 'Barlow', sans-serif; }

        .acnav-link {
          font-family: 'Barlow', sans-serif;
          font-size: 0.845rem;
          font-weight: 400;
          letter-spacing: 0.025em;
          color: rgba(255,255,255,0.86);
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .acnav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: white;
          transition: width 0.25s ease;
        }
        .acnav-link:hover            { color: white; }
        .acnav-link:hover::after     { width: 100%; }
      `}</style>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -NAV_HEIGHT, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: NAV_HEIGHT,
          background:
            scrolled || !isHeroPage
              ? "rgba(3,8,20,0.88)"
              : "transparent",
          backdropFilter:
            scrolled || !isHeroPage ? "blur(16px) saturate(1.5)" : "none",
          WebkitBackdropFilter:
            scrolled || !isHeroPage ? "blur(16px) saturate(1.5)" : "none",
          borderBottom: `1px solid ${
            scrolled ? "rgba(255,255,255,0.07)" : "transparent"
          }`,
          transition:
            "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        <div
          className="h-full flex items-center justify-between"
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 96px)",
          }}
        >
          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <button
            onClick={() => onNavigate("landing")}
            className="flex flex-col items-start flex-shrink-0"
            style={{ gap: 2, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            aria-label={brand.nombre}
          >
            {/* Arco característico Autocity */}
            <svg width="108" height="11" viewBox="0 0 108 11" fill="none" aria-hidden>
              <path
                d="M4 10 C 28 1.5, 80 1.5, 104 10"
                stroke="white"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
            <span
              className="acnav-brand"
              style={{
                color: "white",
                letterSpacing: "0.24em",
                fontWeight: 700,
                fontSize: "1.05rem",
                lineHeight: 1,
                textTransform: "uppercase",
              }}
            >
              {brand.nombre.toUpperCase()}
            </span>
          </button>

          {/* ── Desktop nav ──────────────────────────────────────────────── */}
          <nav className="hidden xl:flex items-center" style={{ gap: 24 }}>
            {navItems.map((item) => (
              <div key={item.label} style={{ position: "relative" }}>
                <a
                  href={item.href}
                  className="acnav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.label === "Usados") onNavigate("catalog");
                  }}
                >
                  {item.label}
                </a>

                {/* Badge "Hot" */}
                {item.badge && (
                  <span
                    className="acnav-brand"
                    style={{
                      position: "absolute",
                      top: -9,
                      right: -20,
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      padding: "1px 5px",
                      borderRadius: 99,
                      background: "var(--sf-accent)",
                      color: "#0a0a0a",
                      pointerEvents: "none",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* ── Right actions ─────────────────────────────────────────────── */}
          <div className="hidden xl:flex items-center" style={{ gap: 16 }}>
            <a
              href={`tel:${brand.whatsapp}`}
              className="acnav-body"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
              }
            >
              <Phone size={13} />
              <span>{brand.whatsapp}</span>
            </a>

            <a
              href={`https://wa.me/${brand.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="acnav-body"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "white",
                background: "var(--sf-whatsapp)",
                textDecoration: "none",
                borderRadius: 6,
                boxShadow: "0 2px 12px rgba(37,211,102,0.28)",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <MessageCircle size={13} />
              WhatsApp
            </a>
          </div>

          {/* ── Mobile hamburger ──────────────────────────────────────────── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            className="xl:hidden"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              display: "flex",
              flexDirection: "column",
              gap: 5,
              alignItems: "flex-end",
            }}
          >
            {/* Tres líneas con anchos diferentes — cierra con X al abrir */}
            {mobileOpen ? (
              <>
                <span style={{ display: "block", width: 22, height: 1.5, background: "white", borderRadius: 2, transform: "rotate(45deg) translateY(4.5px)", transition: "transform 0.2s" }} />
                <span style={{ display: "block", width: 22, height: 1.5, background: "white", borderRadius: 2, transform: "rotate(-45deg) translateY(-4.5px)", transition: "transform 0.2s" }} />
              </>
            ) : (
              <>
                <span style={{ display: "block", width: 24, height: 1.5, background: "white", borderRadius: 2 }} />
                <span style={{ display: "block", width: 17, height: 1.5, background: "white", borderRadius: 2 }} />
                <span style={{ display: "block", width: 24, height: 1.5, background: "white", borderRadius: 2 }} />
              </>
            )}
          </button>
        </div>
      </motion.header>

      {/* ── Mobile menu ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="xl:hidden fixed inset-x-0 z-40"
            style={{
              top: NAV_HEIGHT,
              background: "rgba(3,8,20,0.97)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <nav
              style={{
                maxWidth: 1440,
                margin: "0 auto",
                padding: "12px clamp(20px,5vw,96px) 20px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    if (item.label === "Usados") onNavigate("catalog");
                  }}
                  className="acnav-body"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 4px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.78)",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 400,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.78)")
                  }
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className="acnav-brand"
                      style={{
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 99,
                        background: "var(--sf-accent)",
                        color: "#0a0a0a",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.a>
              ))}

              {/* WhatsApp mobile CTA */}
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <a
                  href={`https://wa.me/${brand.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="acnav-body"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "13px",
                    borderRadius: 8,
                    background: "var(--sf-whatsapp)",
                    color: "white",
                    fontWeight: 500,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                  }}
                >
                  <MessageCircle size={16} />
                  Escribinos por WhatsApp
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer para páginas que no son hero (el hero se pone debajo del nav) */}
      {!isHeroPage && <div style={{ height: NAV_HEIGHT }} />}
    </>
  );
}
