import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Make sure the output directory is correct
    sourcemap: true, // Optional: Helps with debugging the build
  },
});
