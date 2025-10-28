import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss({
    config: './tailwind.config.js', 
  })],
  server: {
    proxy: {
      // Qualquer requisição começando com '/api' será redirecionada
      "/api": {
        target: "http://localhost:3001", // Para o backend
        changeOrigin: true, 
      },
    },
  },
});
