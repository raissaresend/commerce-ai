import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Qualquer requisição começando com '/api' será redirecionada
      "/api": {
        target: "http://localhost:3001", // Para o seu backend
        changeOrigin: true, // Importante para evitar erros
        // secure: false, // Descomente se seu backend usar HTTPS inválido
      },
    },
  },
});
