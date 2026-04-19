import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,   // falla si 3000 está ocupado, nunca roba el 3001
    open: true,
    proxy: {
      // Redirige /api/* al backend de stock-product corriendo en :3001
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
      // Redirige /uploads/* al backend también
      "/uploads": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
