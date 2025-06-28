import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Allow access from network
    strictPort: false, // If port 3000 is busy, try the next available port
  },
  preview: {
    port: 3000,
    host: true,
  },
});
