import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer({ open: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase the default 500 KB warning limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom")) return "react-dom-vendor";
            if (id.includes("react")) return "react-vendor";
            if (id.includes("react-toastify")) return "toastify-vendor";
            if (id.includes("axios")) return "axios-vendor";
            if (id.includes("zustand")) return "zustand-vendor"; // Add more as needed
            return "vendor";
          }
        },
      },
    },
  },
});
