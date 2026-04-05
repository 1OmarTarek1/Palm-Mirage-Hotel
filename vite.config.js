import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (
            id.includes("@react-pdf/renderer") ||
            id.includes("@react-pdf/render") ||
            id.includes("@react-pdf/layout") ||
            id.includes("@react-pdf/textkit") ||
            id.includes("@react-pdf/font") ||
            id.includes("@react-pdf/image") ||
            id.includes("@react-pdf/stylesheet") ||
            id.includes("@react-pdf/primitives") ||
            id.includes("@react-pdf/fns")
          ) {
            return "pdf-runtime";
          }

          if (id.includes("@react-pdf/reconciler")) {
            return "pdf-reconciler";
          }

          if (id.includes("@react-pdf")) {
            return "pdf-core";
          }

          if (
            id.includes("pdfkit") ||
            id.includes("fontkit") ||
            id.includes("restructure") ||
            id.includes("unicode-properties") ||
            id.includes("unicode-trie") ||
            id.includes("linebreak") ||
            id.includes("brotli") ||
            id.includes("jay-peg")
          ) {
            return "pdf-engine";
          }

          if (id.includes("yoga-layout")) {
            return "pdf-layout";
          }

          if (id.includes("lucide-react")) {
            return "icons";
          }

          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) {
            return "motion";
          }

          if (id.includes("react-router-dom") || id.includes("react-router")) {
            return "router";
          }

          if (id.includes("@reduxjs/toolkit") || id.includes("react-redux") || id.includes("redux")) {
            return "state";
          }

          if (
            id.includes("socket.io-client") ||
            id.includes("engine.io-client") ||
            id.includes("socket.io-parser") ||
            id.includes("engine.io-parser")
          ) {
            return "realtime";
          }

          if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("zod")) {
            return "forms";
          }

          return undefined;
        },
      },
    },
  },
  server: {
    headers: { 
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
})  
