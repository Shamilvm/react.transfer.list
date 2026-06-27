import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // point "@veeyem/react-transfer-list" to your src directly
      // so the demo uses live source, not the built dist
      "@veeyem/react-transfer-list": new URL("./src/index.ts", import.meta.url).pathname,
    },
  },
  root: "demo",
  server: {
    port: 3000,
  },
});
