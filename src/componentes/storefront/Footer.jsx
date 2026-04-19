import { useState } from "react";
import { motion } from "framer-motion";
import {
  Instagram, Facebook, Twitter, Youtube, Linkedin,
  Mail, Phone, MapPin, Send, ArrowRight, ExternalLink,
  Shield, FileText, MessageCircle,
} from "lucide-react";
import { BRAND, LOCATIONS } from "../../config/storefrontConfig";

// ─── Newsletter Form ───────────────────────────────────────────────────────────
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <div>
      <h4 className="font-bold text-sm text-white mb-2">Newsletter</h4>
      <p className="text-slate-400 text-xs mb-4 leading-relaxed">
        Suscribite y recibí novedades, oportunidades exclusivas y actualizaciones del mercado.
      </p>

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--sf-accent)" }}
        >
          <span className="text-lg">✓</span>
          ¡Gracias! Ya estás suscripto.
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--sf-accent)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />
          </div>
          <motion.button
            type="submit"
            disabled={status === "loading"}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: "var(--sf-accent)",
              color: "#0a0a0a",
            }}
          >
            {status === "loading" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full"
              />
            ) : (
              <Send size={15} />
            )}
          </motion.button>
        </form>
      )}
    </div>
  );
}

// ─── Social Icon Button ────────────────────────────────────────────────────────
function SocialLink({ Icon, href, label }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ y: -3, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
      style={{
        background: "rgba(255,255,255,0.07)",
        color: "rgba(250,250,249,0.6)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--sf-accent)";
        e.currentTarget.style.color = "#0a0a0a";
        e.currentTarget.style.borderColor = "transparent";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        e.currentTarget.style.color = "rgba(250,250,249,0.6)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <Icon size={15} />
    </motion.a>
  );
}

// ─── Footer Link ───────────────────────────────────────────────────────────────
function FooterLink({ href, children, external }) {
  const Tag = external ? "a" : "a"; // Swap for <Link> if using React Router
  return (
    <Tag
      href={href || "#"}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-sm text-slate-400 transition-colors hover:text-white flex items-center gap-1.5"
    >
      {children}
      {external && <ExternalLink size={10} />}
    </Tag>
  );
}

// ─── Main Footer ───────────────────────────────────────────────────────────────
export default function Footer({ onNavigateCatalog }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── CTA Banner ── */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                ¿Listo para encontrar lo que buscás?
              </h3>
              <p className="text-slate-400 text-sm">Más de 200 opciones disponibles. Precios actualizados diariamente.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNavigateCatalog}
              className="flex items-center gap-3 px-7 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--sf-accent), var(--sf-accent-dark))",
                color: "#0a0a0a",
                boxShadow: "0 4px 20px rgba(201,168,76,0.3)",
              }}
            >
              Ver catálogo
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ background: "var(--sf-accent)", color: "#0a0a0a" }}
              >
                {BRAND.name.charAt(0)}
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                {BRAND.name}
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {BRAND.description}
            </p>

            {/* Social links */}
            <div className="flex gap-2 flex-wrap">
              <SocialLink Icon={Instagram} href="#" label="Instagram" />
              <SocialLink Icon={Facebook} href="#" label="Facebook" />
              <SocialLink Icon={Twitter} href="#" label="Twitter/X" />
              <SocialLink Icon={Youtube} href="#" label="YouTube" />
              <SocialLink Icon={Linkedin} href="#" label="LinkedIn" />
              <SocialLink
                Icon={MessageCircle}
                href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
                label="WhatsApp"
              />
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">Navegación</h4>
            <nav className="flex flex-col gap-3">
              <FooterLink href="#">Inicio</FooterLink>
              <FooterLink href="#">Catálogo</FooterLink>
              <FooterLink href="#">Financiación</FooterLink>
              <FooterLink href="#">Vendé tu auto</FooterLink>
              <FooterLink href="#">Tasaciones</FooterLink>
              <FooterLink href="#">Contacto</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
            </nav>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">Contacto</h4>
            <div className="space-y-4 mb-6">
              <a
                href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <MessageCircle size={15} className="mt-0.5 flex-shrink-0 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">WhatsApp</p>
                  <span className="text-sm">{BRAND.whatsapp}</span>
                </div>
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <Mail size={15} className="mt-0.5 flex-shrink-0 text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <span className="text-sm">{BRAND.email}</span>
                </div>
              </a>
              {LOCATIONS[0] && (
                <div className="flex items-start gap-3 text-slate-400">
                  <MapPin size={15} className="mt-0.5 flex-shrink-0 text-slate-500" />
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Dirección principal</p>
                    <span className="text-sm leading-relaxed">{LOCATIONS[0].address}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Hours */}
            {LOCATIONS[0] && (
              <div
                className="flex items-start gap-2 p-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--sf-accent)" }} />
                <p className="text-xs text-slate-400 leading-relaxed">{LOCATIONS[0].hours}</p>
              </div>
            )}
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-bold text-sm text-white mb-5 uppercase tracking-wider">Suscribite</h4>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div
        className="border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 order-2 sm:order-1">
            © {currentYear} {BRAND.name}. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-5 order-1 sm:order-2">
            <FooterLink href="#">
              <Shield size={11} />
              Política de privacidad
            </FooterLink>
            <FooterLink href="#">
              <FileText size={11} />
              Términos de uso
            </FooterLink>
            <FooterLink href="#">Cookies</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
