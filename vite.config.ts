import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ["antd"],
          react: ["react", "react-dom"],
          remixRuntime: ["@remix-run/react"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["antd", "@ant-design/icons", "react", "react-dom"],
  },
  server: {
    hmr: true,
    port: 5173,
  },
});
