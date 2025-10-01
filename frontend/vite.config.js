// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    "@/api": path.resolve(__dirname, "./src/api/todos.ts"),
    "@/notifications": path.resolve(__dirname, "./src/notifications"),
  },
},
  server: {
    host: true,       // (o '0.0.0.0')
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000", // backend offline
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: true,
    port: 3000,
  },
});
