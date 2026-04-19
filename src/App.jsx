import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { applyTheme, THEME } from "./config/storefrontConfig";
import { StoreConfigProvider, useStoreConfig } from "./contextos/StoreConfigContext";
import Navbar from "./componentes/storefront/Navbar";
import LandingPage from "./paginas/LandingPage";
import CatalogPage from "./paginas/CatalogPage";
import ProductDetailPage from "./paginas/ProductDetailPage";
import AdminProductForm from "./componentes/admin/CustomAttributesBuilder";
import { WhatsAppFloatingButton } from "./componentes/storefront/WhatsAppBridge";

const ROUTES = { landing: "landing", catalog: "catalog", detail: "detail", admin: "admin" };

const pageVariants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.2,  ease: "easeIn" } },
};

function AppShell() {
  const [page, setPage]                     = useState(ROUTES.landing);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [initialSearch, setInitialSearch]   = useState(null);

  // Aplicar tema base + overrides dinámicos del backend
  const { theme: themeOverrides } = useStoreConfig();
  useEffect(() => { applyTheme(themeOverrides); }, [themeOverrides]);

  const navigate = (route, params = {}) => {
    setPage(route);
    if (params.product) setSelectedProduct(params.product);
    if (params.search)  setInitialSearch(params.search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navbar uses string route names
  const handleNavNavigate = (route) => navigate(route);

  return (
    <>
      {/* Sticky navbar — sits above all pages */}
      <Navbar onNavigate={handleNavNavigate} currentPage={page} />

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          {page === ROUTES.landing && (
            <LandingPage
              onSearch={(params) => navigate(ROUTES.catalog, { search: params })}
              onNavigateCatalog={(params) => navigate(ROUTES.catalog, params ? { search: params } : {})}
            />
          )}

          {page === ROUTES.catalog && (
            <CatalogPage
              initialSearch={initialSearch}
              onSelectProduct={(product) => navigate(ROUTES.detail, { product })}
            />
          )}

          {page === ROUTES.detail && (
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => navigate(ROUTES.catalog)}
            />
          )}

          {page === ROUTES.admin && (
            <div style={{ paddingTop: 60 }}>
              <AdminProductForm
                onSave={(schema) => console.log("Schema guardado:", schema)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating WhatsApp — visible en catálogo y detalle */}
      {(page === ROUTES.catalog || page === ROUTES.detail) && (
        <WhatsAppFloatingButton onClick={() => {}} />
      )}
    </>
  );
}

export default function App() {
  return (
    <StoreConfigProvider>
      <AppShell />
    </StoreConfigProvider>
  );
}
