import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, ChevronRight, Send,
  User, Phone, Check,
} from "lucide-react";
import { BRAND } from "../../config/storefrontConfig";

// ─── Build the WhatsApp URL ────────────────────────────────────────────────────
function buildWhatsAppURL(phone, product, customMessage) {
  const cleanPhone = phone.replace(/\D/g, "");
  const message = customMessage || buildDefaultMessage(product);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function buildDefaultMessage(product) {
  if (!product) {
    return `¡Hola! Me comunico desde su sitio web y quisiera obtener más información.`;
  }

  const formatPrice = (p) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(p);

  const specsLine = product.specs
    ? Object.entries(product.specs)
        .slice(0, 4)
        .map(([k, v]) => `  • ${product.specLabels?.[k] || k}: ${v}`)
        .join("\n")
    : "";

  return [
    `¡Hola! 👋 Me comunico desde su sitio web.`,
    ``,
    `Estoy interesado/a en el siguiente artículo:`,
    ``,
    `*${product.title}*`,
    `💰 Precio: ${formatPrice(product.price)}`,
    `🔖 ID: #${product.id}`,
    specsLine ? `\n📋 Especificaciones:\n${specsLine}` : "",
    ``,
    `¿Podrían brindarme más información y disponibilidad? Muchas gracias.`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}

// ─── Floating WhatsApp Button (always visible) ─────────────────────────────────
export function WhatsAppFloatingButton({ onClick }) {
  const [pulseVisible, setPulseVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPulseVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Tooltip bubble */}
      <AnimatePresence>
        {pulseVisible && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-lg"
            style={{
              background: "white",
              color: "var(--sf-text)",
              border: "1px solid var(--sf-border)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}
          >
            ¿Necesitás ayuda?
            <ChevronRight size={14} className="text-[var(--sf-text-muted)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl"
        style={{
          background: "var(--sf-whatsapp)",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
        }}
      >
        {/* Ripple ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--sf-whatsapp)" }}
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut", repeatDelay: 1 }}
        />
        <MessageCircle size={24} strokeWidth={2} />
      </motion.button>
    </motion.div>
  );
}

// ─── WhatsApp Bridge Modal ─────────────────────────────────────────────────────
export default function WhatsAppBridge({ product, onClose }) {
  const [message, setMessage] = useState(() => buildDefaultMessage(product));
  const [step, setStep] = useState("preview"); // "preview" | "sent"
  const [name, setName] = useState("");

  const whatsappUrl = buildWhatsAppURL(BRAND.whatsapp, product, message);

  const formatPrice = (p) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(p);

  const handleSend = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setStep("sent");
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 60, scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full sm:max-w-lg rounded-t-[24px] sm:rounded-[20px] overflow-hidden"
        style={{ background: "var(--sf-card-bg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: "var(--sf-whatsapp)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{BRAND.name}</p>
              <p className="text-white/75 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block" />
                En línea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={15} className="text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === "preview" ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Product preview card */}
                {product && (
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl mb-5 border border-[var(--sf-border)]"
                    style={{ background: "var(--sf-page-bg)" }}
                  >
                    <div className="w-14 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={product.images?.[0] || "/api/placeholder/100/80"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-[var(--sf-text)] truncate">{product.title}</p>
                      <p className="text-[var(--sf-accent)] text-sm font-bold">{formatPrice(product.price)}</p>
                    </div>
                    <span className="text-[10px] text-[var(--sf-text-faint)]">ID #{product.id}</span>
                  </div>
                )}

                {/* Message preview (WhatsApp bubble style) */}
                <p className="text-xs font-semibold text-[var(--sf-text-muted)] uppercase tracking-wider mb-3">
                  Mensaje
                </p>
                <div
                  className="rounded-xl p-4 mb-5 relative"
                  style={{
                    background: "#dcf8c6",
                    border: "1px solid #c1e8a5",
                  }}
                >
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={7}
                    className="w-full text-sm bg-transparent resize-none outline-none leading-relaxed"
                    style={{ color: "#1a3a1a", fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <p className="text-right text-[10px] text-[#7da87d] mt-1">Editá el mensaje antes de enviar</p>
                </div>

                {/* Send button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSend}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white text-base"
                  style={{
                    background: "var(--sf-whatsapp)",
                    boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
                  }}
                >
                  <Send size={18} />
                  Abrir WhatsApp y enviar
                </motion.button>

                <p className="text-center text-xs text-[var(--sf-text-faint)] mt-3">
                  Se abrirá WhatsApp con el mensaje pre-cargado
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "rgba(37,211,102,0.12)" }}
                >
                  <Check size={30} style={{ color: "var(--sf-whatsapp)" }} />
                </motion.div>
                <h3 className="font-bold text-xl text-[var(--sf-text)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ¡Mensaje enviado!
                </h3>
                <p className="text-sm text-[var(--sf-text-muted)] mb-8 max-w-xs">
                  Nos pondremos en contacto con vos a la brevedad. Respondemos en menos de 30 minutos.
                </p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl text-sm font-semibold border border-[var(--sf-border)] text-[var(--sf-text)] hover:border-[var(--sf-border-strong)] transition-all"
                >
                  Cerrar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
