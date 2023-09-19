/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import path from "path";
import dynamicImport from "vite-plugin-dynamic-import";
import checker from "vite-plugin-checker";
import timeReporter from "vite-plugin-time-reporter";
import pkg from "./package.json" assert { type: "json" };
import https from "https";

export default async ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return await defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./test/setupTests.ts", "./test/globalSetup.ts"],
    },
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    server: {
      port: parseInt(process.env.VITE_APP_PORT || "") || 8001,
      https: true,
      proxy: {
        "/proxy-api": {
          target: process.env.VITE_APP_APIBASE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy-api/, ""),
          agent: new https.Agent(),
        },
      },
      hmr: {
        overlay: false,
      },
    },
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: path.join(__dirname, "./src/"),
        },
      ],
    },
    build: {
      rollupOptions: {
        external: [/.test.tsx/],
      },
    },
    plugins: [
      basicSsl(),
      timeReporter(),
      dynamicImport(),
      react(),
      checker({
        typescript: true,
      }),
    ],
  });
};
