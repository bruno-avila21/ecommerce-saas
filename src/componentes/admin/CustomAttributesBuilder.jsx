import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus, Trash2, GripVertical, ChevronDown, Eye,
  Copy, Save, Undo2, Tag, ToggleLeft, Hash, AlignLeft,
  List, Type, CheckSquare,
} from "lucide-react";
import { NICHES } from "../../config/storefrontConfig";

// ─── Attribute Types ───────────────────────────────────────────────────────────
const ATTR_TYPES = [
  { id: "text",    label: "Texto",        icon: Type,        desc: "Ej: Color, Marca" },
  { id: "number",  label: "Número",       icon: Hash,        desc: "Ej: Año, Km, m²" },
  { id: "select",  label: "Lista",        icon: List,        desc: "Opciones fijas" },
  { id: "boolean", label: "Sí / No",      icon: ToggleLeft,  desc: "Ej: Tiene cochera" },
  { id: "textarea",label: "Texto largo",  icon: AlignLeft,   desc: "Descripción" },
  { id: "tag",     label: "Etiqueta",     icon: Tag,         desc: "Ej: Estado, Badge" },
];

const GROUPS = ["general", "técnico", "adicional", "confort", "seguridad"];

let idCounter = 1000;
const genId = () => `attr_${++idCounter}`;

// ─── Type Selector Dropdown ────────────────────────────────────────────────────
function TypeSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = ATTR_TYPES.find((t) => t.id === value) || ATTR_TYPES[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm w-full transition-colors"
        style={{
          borderColor: open ? "var(--sf-accent)" : "var(--sf-border)",
          background: "var(--sf-card-bg)",
          color: "var(--sf-text)",
        }}
      >
        <current.icon size={13} className="text-[var(--sf-text-muted)]" />
        {current.label}
        <ChevronDown size={12} className="ml-auto text-[var(--sf-text-muted)]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border overflow-hidden shadow-xl"
            style={{ background: "var(--sf-card-bg)", borderColor: "var(--sf-border)" }}
          >
            {ATTR_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => { onChange(type.id); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-[var(--sf-page-bg)] text-left"
                  style={{
                    background: value === type.id ? "var(--sf-accent-light)" : "transparent",
                    color: value === type.id ? "var(--sf-accent-dark)" : "var(--sf-text)",
                  }}
                >
                  <Icon size={13} />
                  <div>
                    <span className="font-medium">{type.label}</span>
                    <span className="text-[11px] block text-[var(--sf-text-faint)]">{type.desc}</span>
                  </div>
                  {value === type.id && <CheckSquare size={13} className="ml-auto" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Single Attribute Row ──────────────────────────────────────────────────────
function AttributeRow({ attr, onChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const update = (field, val) => onChange({ ...attr, [field]: val });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="group rounded-xl border border-[var(--sf-border)] overflow-hidden transition-all"
      style={{
        background: "var(--sf-card-bg)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 p-3">
        {/* Drag handle */}
        <div className="cursor-grab text-[var(--sf-border-strong)] hover:text-[var(--sf-text-muted)] transition-colors">
          <GripVertical size={15} />
        </div>

        {/* Key */}
        <div className="w-28 flex-shrink-0">
          <input
            type="text"
            placeholder="clave_interna"
            value={attr.key}
            onChange={(e) => update("key", e.target.value.replace(/\s+/g, "_").toLowerCase())}
            className="w-full px-2 py-1.5 rounded-lg text-xs border outline-none font-mono transition-colors"
            style={{
              borderColor: "var(--sf-border)",
              background: "var(--sf-page-bg)",
              color: "var(--sf-text)",
            }}
          />
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="Etiqueta visible"
            value={attr.label}
            onChange={(e) => update("label", e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg text-sm border outline-none transition-colors"
            style={{
              borderColor: "var(--sf-border)",
              background: "var(--sf-page-bg)",
              color: "var(--sf-text)",
            }}
          />
        </div>

        {/* Type */}
        <div className="w-32 flex-shrink-0">
          <TypeSelector value={attr.type} onChange={(val) => update("type", val)} />
        </div>

        {/* Group */}
        <div className="w-28 flex-shrink-0">
          <select
            value={attr.group}
            onChange={(e) => update("group", e.target.value)}
            className="w-full px-2 py-2 rounded-lg text-xs border outline-none transition-colors capitalize"
            style={{
              borderColor: "var(--sf-border)",
              background: "var(--sf-page-bg)",
              color: "var(--sf-text)",
            }}
          >
            {GROUPS.map((g) => (
              <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Expand / delete */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {(attr.type === "select" || attr.suffix !== undefined) && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "var(--sf-text-muted)", background: expanded ? "var(--sf-accent-light)" : "transparent" }}
            >
              <ChevronDown size={13} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
            style={{ color: "var(--sf-text-faint)" }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expanded options */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-0 border-t flex flex-wrap gap-4 items-start"
              style={{ borderColor: "var(--sf-border)" }}
            >
              {/* Suffix/prefix for number types */}
              {attr.type === "number" && (
                <>
                  <div>
                    <label className="text-xs text-[var(--sf-text-muted)] block mb-1">Prefijo</label>
                    <input
                      type="text"
                      placeholder="$, €"
                      value={attr.prefix || ""}
                      onChange={(e) => update("prefix", e.target.value)}
                      className="px-2 py-1.5 w-20 rounded-lg text-xs border outline-none"
                      style={{ borderColor: "var(--sf-border)", background: "var(--sf-page-bg)", color: "var(--sf-text)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--sf-text-muted)] block mb-1">Sufijo</label>
                    <input
                      type="text"
                      placeholder="km, m², HP"
                      value={attr.suffix || ""}
                      onChange={(e) => update("suffix", e.target.value)}
                      className="px-2 py-1.5 w-24 rounded-lg text-xs border outline-none"
                      style={{ borderColor: "var(--sf-border)", background: "var(--sf-page-bg)", color: "var(--sf-text)" }}
                    />
                  </div>
                </>
              )}

              {/* Options for select type */}
              {attr.type === "select" && (
                <div className="flex-1">
                  <label className="text-xs text-[var(--sf-text-muted)] block mb-2">Opciones (una por línea)</label>
                  <textarea
                    rows={3}
                    placeholder={"Opción 1\nOpción 2\nOpción 3"}
                    value={(attr.options || []).join("\n")}
                    onChange={(e) => update("options", e.target.value.split("\n").filter(Boolean))}
                    className="w-full px-2 py-1.5 rounded-lg text-xs border outline-none resize-none"
                    style={{ borderColor: "var(--sf-border)", background: "var(--sf-page-bg)", color: "var(--sf-text)" }}
                  />
                </div>
              )}

              {/* Required toggle */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-[var(--sf-text-muted)]">Requerido</label>
                <button
                  type="button"
                  onClick={() => update("required", !attr.required)}
                  className="relative w-9 h-5 rounded-full transition-colors"
                  style={{ background: attr.required ? "var(--sf-accent)" : "var(--sf-border)" }}
                >
                  <motion.div
                    animate={{ x: attr.required ? 16 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Admin Product Form ────────────────────────────────────────────────────────
export default function AdminProductForm({ onSave }) {
  const [niche, setNiche] = useState("vehiculos");
  const [attributes, setAttributes] = useState(() =>
    (NICHES[niche]?.defaultAttributes || []).map((a) => ({ ...a, id: genId() }))
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [productData, setProductData] = useState({});
  const [history, setHistory] = useState([]);

  // Change niche → reload default attributes
  const handleNicheChange = (newNiche) => {
    setNiche(newNiche);
    setAttributes(
      (NICHES[newNiche]?.defaultAttributes || []).map((a) => ({ ...a, id: genId() }))
    );
  };

  const addAttribute = () => {
    setHistory((h) => [attributes, ...h.slice(0, 9)]);
    setAttributes((prev) => [
      ...prev,
      { id: genId(), key: "", label: "", type: "text", group: "general", required: false },
    ]);
  };

  const updateAttribute = useCallback((id, updated) => {
    setAttributes((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }, []);

  const deleteAttribute = useCallback((id) => {
    setHistory((h) => [attributes, ...h.slice(0, 9)]);
    setAttributes((prev) => prev.filter((a) => a.id !== id));
  }, [attributes]);

  const undo = () => {
    if (history.length === 0) return;
    setAttributes(history[0]);
    setHistory((h) => h.slice(1));
  };

  const handleSaveSchema = () => {
    if (onSave) onSave({ niche, attributes });
  };

  // Group for preview
  const grouped = attributes.reduce((acc, attr) => {
    const g = attr.group || "general";
    if (!acc[g]) acc[g] = [];
    acc[g].push(attr);
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "var(--sf-page-bg)", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-[var(--sf-text)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Constructor de atributos
            </h1>
            <p className="text-sm text-[var(--sf-text-muted)] mt-1">
              Definí los campos personalizados para tu tipo de producto
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={history.length === 0}
              className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all disabled:opacity-30 hover:border-[var(--sf-border-strong)]"
              style={{ borderColor: "var(--sf-border)", color: "var(--sf-text-muted)" }}
              title="Deshacer"
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-all"
              style={{
                borderColor: previewMode ? "var(--sf-accent)" : "var(--sf-border)",
                background: previewMode ? "var(--sf-accent-light)" : "transparent",
                color: previewMode ? "var(--sf-accent-dark)" : "var(--sf-text-muted)",
              }}
            >
              <Eye size={14} /> Vista previa
            </button>
            <button
              type="button"
              onClick={handleSaveSchema}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: "var(--sf-text)",
                color: "var(--sf-hero-text)",
              }}
            >
              <Save size={14} /> Guardar esquema
            </button>
          </div>
        </div>

        {/* Niche selector */}
        <div
          className="p-5 rounded-[var(--sf-radius-lg)] border border-[var(--sf-border)] mb-6"
          style={{ background: "var(--sf-card-bg)" }}
        >
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--sf-text-muted)] block mb-3">
            Tipo de producto / Nicho
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(NICHES).map(([id, niche_]) => (
              <button
                key={id}
                type="button"
                onClick={() => handleNicheChange(id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all"
                style={{
                  borderColor: niche === id ? "var(--sf-accent)" : "var(--sf-border)",
                  background: niche === id ? "var(--sf-accent-light)" : "transparent",
                  color: niche === id ? "var(--sf-accent-dark)" : "var(--sf-text-muted)",
                }}
              >
                <span>{niche_.icon}</span>
                {niche_.label}
              </button>
            ))}
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-dashed transition-all hover:border-[var(--sf-border-strong)]"
              style={{ borderColor: "var(--sf-border)", color: "var(--sf-text-faint)" }}
            >
              <Plus size={14} /> Nicho personalizado
            </button>
          </div>
        </div>

        {!previewMode ? (
          /* ── Builder Mode ── */
          <div>
            {/* Column headers */}
            <div className="grid grid-cols-[32px_112px_1fr_128px_112px_60px] gap-3 px-3 mb-2">
              {["", "Clave", "Etiqueta", "Tipo", "Grupo", ""].map((h, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-[var(--sf-text-faint)]">{h}</span>
              ))}
            </div>

            {/* Attribute rows */}
            <Reorder.Group
              axis="y"
              values={attributes}
              onReorder={(next) => {
                setHistory((h) => [attributes, ...h.slice(0, 9)]);
                setAttributes(next);
              }}
              className="space-y-2"
            >
              <AnimatePresence>
                {attributes.map((attr) => (
                  <Reorder.Item key={attr.id} value={attr}>
                    <AttributeRow
                      attr={attr}
                      onChange={(updated) => updateAttribute(attr.id, updated)}
                      onDelete={() => deleteAttribute(attr.id)}
                    />
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {/* Add attribute button */}
            <motion.button
              type="button"
              onClick={addAttribute}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-medium transition-all hover:border-[var(--sf-accent)] hover:text-[var(--sf-accent)] hover:bg-[var(--sf-accent-light)]"
              style={{ borderColor: "var(--sf-border)", color: "var(--sf-text-muted)" }}
            >
              <Plus size={15} />
              Agregar atributo
            </motion.button>

            {/* Stats */}
            <div className="flex items-center gap-4 mt-4 px-1">
              <span className="text-xs text-[var(--sf-text-faint)]">
                {attributes.length} atributos definidos
              </span>
              <span className="text-xs text-[var(--sf-text-faint)]">·</span>
              <span className="text-xs text-[var(--sf-text-faint)]">
                {attributes.filter((a) => a.required).length} requeridos
              </span>
            </div>
          </div>
        ) : (
          /* ── Preview Mode ── */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="p-6 rounded-[var(--sf-radius-lg)] border border-[var(--sf-border)]"
              style={{ background: "var(--sf-card-bg)" }}
            >
              <h3 className="font-bold text-[var(--sf-text)] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Vista previa del formulario — {NICHES[niche]?.label}
              </h3>

              {Object.entries(grouped).map(([group, attrs]) => (
                <div key={group} className="mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--sf-text-muted)] mb-3 capitalize">
                    {group}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {attrs.filter((a) => a.key && a.label).map((attr) => (
                      <div key={attr.id}>
                        <label className="block text-xs font-medium text-[var(--sf-text-muted)] mb-1">
                          {attr.label}
                          {attr.required && <span className="text-red-400 ml-0.5">*</span>}
                        </label>
                        {attr.type === "text" && (
                          <input
                            type="text"
                            placeholder={`Ingresá ${attr.label.toLowerCase()}…`}
                            className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                            style={{ borderColor: "var(--sf-border)", background: "var(--sf-page-bg)", color: "var(--sf-text)" }}
                          />
                        )}
                        {attr.type === "number" && (
                          <div className="flex">
                            {attr.prefix && (
                              <span className="px-2 py-2 rounded-l-lg border border-r-0 text-xs text-[var(--sf-text-muted)]"
                                    style={{ borderColor: "var(--sf-border)", background: "var(--sf-page-bg-2)" }}>
                                {attr.prefix}
                              </span>
                            )}
                            <input
                              type="number"
                              placeholder="0"
                              className="flex-1 px-3 py-2 text-sm border outline-none"
                              style={{
                                borderColor: "var(--sf-border)",
                                background: "var(--sf-page-bg)",
                                color: "var(--sf-text)",
                                borderRadius: attr.prefix ? "0" : "var(--sf-radius-sm)",
                                borderTopRightRadius: attr.suffix ? "0" : undefined,
                                borderBottomRightRadius: attr.suffix ? "0" : undefined,
                              }}
                            />
                            {attr.suffix && (
                              <span className="px-2 py-2 rounded-r-lg border border-l-0 text-xs text-[var(--sf-text-muted)]"
                                    style={{ borderColor: "var(--sf-border)", background: "var(--sf-page-bg-2)" }}>
                                {attr.suffix}
                              </span>
                            )}
                          </div>
                        )}
                        {attr.type === "select" && (
                          <select
                            className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                            style={{ borderColor: "var(--sf-border)", background: "var(--sf-page-bg)", color: "var(--sf-text)" }}
                          >
                            <option value="">Seleccionar…</option>
                            {(attr.options || []).map((o) => <option key={o}>{o}</option>)}
                          </select>
                        )}
                        {attr.type === "boolean" && (
                          <div className="flex gap-3">
                            {["Sí", "No"].map((opt) => (
                              <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                                <input type="radio" name={attr.key} className="accent-[var(--sf-accent)]" />
                                <span className="text-sm text-[var(--sf-text-muted)]">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}
                        {attr.type === "textarea" && (
                          <textarea
                            rows={3}
                            placeholder={`Ingresá ${attr.label.toLowerCase()}…`}
                            className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none"
                            style={{ borderColor: "var(--sf-border)", background: "var(--sf-page-bg)", color: "var(--sf-text)" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {attributes.filter((a) => a.key && a.label).length === 0 && (
                <p className="text-center text-sm text-[var(--sf-text-faint)] py-8">
                  Agregá atributos para verlos aquí.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
