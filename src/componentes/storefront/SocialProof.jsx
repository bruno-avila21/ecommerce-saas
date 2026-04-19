import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Plus, Minus, Quote } from "lucide-react";
import { TESTIMONIALS, FAQS } from "../../config/storefrontConfig";

// ─── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          fill={s <= rating ? "var(--sf-accent)" : "none"}
          stroke={s <= rating ? "var(--sf-accent)" : "var(--sf-border-strong)"}
        />
      ))}
    </div>
  );
}

// ─── Testimonial Card ──────────────────────────────────────────────────────────
function TestimonialCard({ testimonial, index }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 w-80 md:w-96"
    >
      <div
        className="h-full p-6 rounded-[var(--sf-radius-lg)] border border-[var(--sf-border)] relative overflow-hidden"
        style={{
          background: "var(--sf-card-bg)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        }}
      >
        {/* Quote icon */}
        <div
          className="absolute top-4 right-5 opacity-[0.07]"
          style={{ color: "var(--sf-accent)" }}
        >
          <Quote size={48} fill="currentColor" />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>

        {/* Text */}
        <p className="text-[var(--sf-text)] text-sm leading-relaxed mb-6 relative z-10">
          "{testimonial.text}"
        </p>

        {/* Bottom: author + meta */}
        <div className="flex items-center gap-3 pt-4 border-t border-[var(--sf-border)]">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: "var(--sf-accent)", color: "#0a0a0a" }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-[var(--sf-text)] truncate">{testimonial.name}</p>
            <p className="text-xs text-[var(--sf-text-faint)]">{testimonial.role}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-[var(--sf-text-faint)]">{testimonial.date}</p>
            <p className="text-[10px] font-medium truncate max-w-[100px]" style={{ color: "var(--sf-accent-dark)" }}>
              {testimonial.product}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Testimonials Carousel ─────────────────────────────────────────────────────
function TestimonialsCarousel() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  return (
    <div className="relative">
      {/* Cards */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={t.id} testimonial={t} index={i} />
        ))}
        {/* End spacer */}
        <div className="w-4 flex-shrink-0" />
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => scroll(-1)}
          disabled={!canScrollLeft}
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
          style={{
            borderColor: "var(--sf-border-strong)",
            color: "var(--sf-text)",
            background: "var(--sf-card-bg)",
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll(1)}
          disabled={!canScrollRight}
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
          style={{
            borderColor: "var(--sf-border-strong)",
            color: "var(--sf-text)",
            background: "var(--sf-card-bg)",
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── FAQ Accordion ─────────────────────────────────────────────────────────────
function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border-b border-[var(--sf-border)] last:border-none"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors"
      >
        <span
          className="font-medium text-sm text-[var(--sf-text)] pr-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {faq.q}
        </span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: isOpen ? "var(--sf-accent)" : "var(--sf-page-bg-2)",
            color: isOpen ? "#0a0a0a" : "var(--sf-text-muted)",
          }}
        >
          {isOpen ? <Minus size={13} /> : <Plus size={13} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[var(--sf-text-muted)] leading-relaxed pb-5 pr-12">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div
      className="rounded-[var(--sf-radius-lg)] border border-[var(--sf-border)] overflow-hidden px-6"
      style={{ background: "var(--sf-card-bg)" }}
    >
      {FAQS.map((faq, i) => (
        <FAQItem
          key={i}
          faq={faq}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}

// ─── Aggregate Stats Banner ────────────────────────────────────────────────────
function TrustStats() {
  const stats = [
    { label: "Clientes satisfechos", value: "2.400+" },
    { label: "Años de experiencia", value: "15+" },
    { label: "Operaciones concretadas", value: "5.800+" },
    { label: "Satisfacción promedio", value: "4.9/5" },
  ];

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-[var(--sf-radius-lg)] overflow-hidden border border-[var(--sf-border)] mb-16"
      style={{ background: "var(--sf-card-bg)" }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="px-6 py-7 text-center"
          style={{
            borderRight: i < stats.length - 1 ? "1px solid var(--sf-border)" : "none",
          }}
        >
          <p
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: "var(--sf-accent)" }}
          >
            {stat.value}
          </p>
          <p className="text-xs text-[var(--sf-text-muted)]">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main SocialProof Component ────────────────────────────────────────────────
export default function SocialProof() {
  return (
    <div style={{ background: "var(--sf-page-bg)" }}>
      {/* ── Testimonials Section ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
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
              Lo que dicen nuestros clientes
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2
                className="text-4xl md:text-5xl font-bold text-[var(--sf-text)] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Historias reales,<br />resultados reales.
              </h2>
              <div className="flex items-center gap-2 pb-1">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={16} fill="var(--sf-accent)" stroke="var(--sf-accent)" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[var(--sf-text)]">4.9</span>
                <span className="text-sm text-[var(--sf-text-muted)]">· +200 reseñas</span>
              </div>
            </div>
          </motion.div>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <TrustStats />
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section
        className="py-24 px-4"
        style={{
          background: "var(--sf-page-bg-2)",
          borderTop: "1px solid var(--sf-border)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: "var(--sf-accent)" }}
            >
              Preguntas frecuentes
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[var(--sf-text)] tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Todo lo que necesitás saber
            </h2>
            <p className="text-[var(--sf-text-muted)] mt-4 text-base">
              ¿Tenés otra pregunta? Contactanos directamente por WhatsApp.
            </p>
          </motion.div>

          <FAQAccordion />
        </div>
      </section>
    </div>
  );
}
