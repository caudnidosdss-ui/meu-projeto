import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion") || id.includes("motion-dom"))
              return "motion";
            if (id.includes("tesseract")) return "ocr";
            if (id.includes("react")) return "vendor";
          }
        },
      },
    },
  },
});
