import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Map an already same-origin development request to the local CF origin.
// Foreign Origin headers remain untouched and are rejected by the Worker.
const communityProxy = {
  target: "http://127.0.0.1:4175",
  changeOrigin: true,
  configure(proxy) {
    proxy.on("proxyReq", (proxyRequest, request) => {
      const origin = request.headers.origin;
      if (
        origin === `http://${request.headers.host}` ||
        origin === `https://${request.headers.host}`
      ) {
        proxyRequest.setHeader("Origin", "http://127.0.0.1:4175");
      }
    });
  },
};
export default defineConfig({
  build: { outDir: "dist/client" },
  optimizeDeps: { include: ["react", "react-dom/client"] },
  preview: { proxy: { "/api": communityProxy } },
  server: {
    proxy: { "/api": communityProxy },
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: { clientFiles: ["./src/main.tsx"] },
  },
  plugins: [react()],
});
