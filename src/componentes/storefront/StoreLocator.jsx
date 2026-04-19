import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, ExternalLink, ChevronRight, Building2 } from "lucide-react";
import { LOCATIONS } from "../../config/storefrontConfig";

// ─── Map Embed Placeholder ─────────────────────────────────────────────────────
function MapPlaceholder({ location }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-[var(--sf-radius-lg)] flex items-center justify-center"
      style={{ background: "var(--sf-page-bg-2)", minHeight: 320 }}
    >
      {/* Decorative grid */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--sf-border-strong)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>

      {/* Concentric circles for pin effect */}
      <div className="relative flex items-center justify-center">
        {[80, 60, 40].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              border: "1px solid var(--sf-accent)",
              opacity: 0.15 + i * 0.1,
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [(0.15 + i * 0.1), (0.05 + i * 0.05), (0.15 + i * 0.1)] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.4, ease: "easeInOut" }}
          />
        ))}
        <div
          className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
          style={{ background: "var(--sf-accent)" }}
        >
          <MapPin size={18} className="text-white" fill="white" />
        </div>
      </div>

      {/* Location name overlay */}
      <div
        className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--sf-border)",
        }}
      >
        <p className="font-semibold text-sm text-[var(--sf-text)]">{location.name}</p>
        <p className="text-xs text-[var(--sf-text-muted)] mt-0.5">{location.address}</p>
      </div>

      {/* Open in maps button */}
      <a
        href={location.mapEmbed}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[var(--sf-accent-light)]"
        style={{
          background: "rgba(255,255,255,0.9)",
          color: "var(--sf-accent-dark)",
          border: "1px solid var(--sf-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink size={11} />
        Ver en Google Maps
      </a>

      {/* "Map not loaded" notice */}
      <div className="absolute top-4 left-4">
        <span
          className="text-[10px] px-2 py-1 rounded-md font-medium"
          style={{ background: "rgba(0,0,0,0.06)", color: "var(--sf-text-muted)" }}
        >
          Vista de mapa
        </span>
      </div>
    </div>
  );
}

// ─── Branch Card ───────────────────────────────────────────────────────────────
function BranchCard({ location, active, onClick }) {
  return (
    <motion.button
      whileHover={{ x: 3 }}
      onClick={onClick}
      className="w-full text-left p-5 rounded-[var(--sf-radius)] border transition-all duration-200"
      style={{
        background: active ? "var(--sf-accent-light)" : "var(--sf-card-bg)",
        borderColor: active ? "var(--sf-accent)" : "var(--sf-border)",
        boxShadow: active ? "0 0 0 3px rgba(201,168,76,0.1)" : "none",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{
            background: active ? "var(--sf-accent)" : "var(--sf-page-bg-2)",
            color: active ? "#0a0a0a" : "var(--sf-text-muted)",
          }}
        >
          <Building2 size={17} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm text-[var(--sf-text)]">{location.name}</h3>
            <ChevronRight size={14} className="text-[var(--sf-text-faint)] flex-shrink-0 ml-2" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <MapPin size={12} className="text-[var(--sf-text-faint)] mt-0.5 flex-shrink-0" />
              <span className="text-xs text-[var(--sf-text-muted)] leading-relaxed">{location.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-[var(--sf-text-faint)] flex-shrink-0" />
              <span className="text-xs text-[var(--sf-text-muted)]">{location.hours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-[var(--sf-text-faint)] flex-shrink-0" />
              <a
                href={`tel:${location.phone}`}
                className="text-xs font-medium transition-colors hover:text-[var(--sf-accent)]"
                style={{ color: "var(--sf-text-muted)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {location.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Main StoreLocator Component ───────────────────────────────────────────────
export default function StoreLocator() {
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0]);

  return (
    <section
      className="py-24 px-4"
      style={{ background: "var(--sf-page-bg-2)", borderTop: "1px solid var(--sf-border)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
            style={{ color: "var(--sf-accent)" }}
          >
            Dónde encontrarnos
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--sf-text)] tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Nuestras ubicaciones
          </h2>
          <p className="text-[var(--sf-text-muted)] mt-3 text-base max-w-md">
            Visitanos en cualquiera de nuestras sucursales. Te esperamos.
          </p>
        </motion.div>

        {/* Layout: branches list + map */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          {/* Branch list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {LOCATIONS.map((loc) => (
              <BranchCard
                key={loc.id}
                location={loc}
                active={activeLocation?.id === loc.id}
                onClick={() => setActiveLocation(loc)}
              />
            ))}

            {/* CTA */}
            <div
              className="mt-4 p-4 rounded-[var(--sf-radius)] border border-dashed border-[var(--sf-border-strong)] text-center"
            >
              <p className="text-sm text-[var(--sf-text-muted)] mb-2">¿Preferís que vayamos a vos?</p>
              <a
                href={`https://wa.me/${LOCATIONS[0]?.phone?.replace(/\D/g, "") || ""}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold transition-colors hover:underline"
                style={{ color: "var(--sf-accent-dark)" }}
              >
                Coordiná una visita →
              </a>
            </div>
          </motion.div>

          {/* Map area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="min-h-[350px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLocation?.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeLocation ? (
                  <MapPlaceholder location={activeLocation} />
                ) : (
                  <div
                    className="w-full h-full rounded-[var(--sf-radius-lg)] flex items-center justify-center"
                    style={{ background: "var(--sf-page-bg)", minHeight: 320 }}
                  >
                    <p className="text-sm text-[var(--sf-text-faint)]">Seleccioná una sucursal</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
