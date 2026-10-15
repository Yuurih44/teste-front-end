import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/products": {
        target: "https://app.econverse.com.br",
        changeOrigin: true,
        proxyTimeout: 10000,
        timeout: 10000,
        rewrite: () =>
          "/teste-front-end/junior/tecnologia/lista-produtos/produtos.json",
      },
    },
  },
  preview: {
    proxy: {
      "/api/products": {
        target: "https://app.econverse.com.br",
        changeOrigin: true,
        proxyTimeout: 10000,
        timeout: 10000,
        rewrite: () =>
          "/teste-front-end/junior/tecnologia/lista-produtos/produtos.json",
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    clearMocks: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
