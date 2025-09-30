import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // o '0.0.0.0'
    port: 3000
  },
  preview: {
    host: true,        // o '0.0.0.0'
    port: 3000
  }
});
