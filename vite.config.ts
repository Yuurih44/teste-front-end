import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
const catalogProxy = {
  "/api/products": {
    target: "https://app.econverse.com.br",
    changeOrigin: true,
    proxyTimeout: 10000,
    timeout: 10000,
    rewrite: () =>
      "/teste-front-end/junior/tecnologia/lista-produtos/produtos.json",
  },
};
export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/teste-front-end/" : "/",
  plugins: [react()],
  server: { proxy: catalogProxy },
  preview: { proxy: catalogProxy },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
    clearMocks: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
