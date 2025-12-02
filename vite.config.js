import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2015",
    minify: "terser",
    cssMinify: true, // Enable CSS minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"], // Remove specific console functions
      },
      mangle: true,
      format: {
        comments: false, // Remove comments
      },
    },
    rollupOptions: {
      output: {
        // Improved chunk splitting strategy
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes("node_modules")) {
            // Core React - smallest possible vendor chunk
            if (
              id.includes("react") &&
              !id.includes("react-router") &&
              !id.includes("react-dom")
            ) {
              return "react-core";
            }
            // React DOM - separate chunk (large)
            if (id.includes("react-dom")) {
              return "react-dom";
            }
            // React Router
            if (id.includes("react-router")) {
              return "router";
            }
            // Radix UI components - separate chunk
            if (id.includes("@radix-ui")) {
              return "ui-radix";
            }
            // Lucide icons - tree-shake but keep in separate chunk
            if (id.includes("lucide-react")) {
              return "icons";
            }
            // Other utilities
            if (
              id.includes("clsx") ||
              id.includes("class-variance-authority") ||
              id.includes("tailwind-merge")
            ) {
              return "utils";
            }
            // cmdk (command menu)
            if (id.includes("cmdk")) {
              return "cmdk";
            }
            // All other node_modules
            return "vendor";
          }

          // Application code chunking by route
          if (id.includes("/pages/")) {
            const pageName = id
              .split("/pages/")[1]
              ?.split(".")[0]
              ?.toLowerCase();
            if (pageName && pageName !== "home") {
              return `page-${pageName}`;
            }
          }

          // Component-based chunking
          if (id.includes("/components/home/")) {
            return "components-home";
          }
          if (id.includes("/components/movie/")) {
            return "components-movie";
          }
        },
        // Asset file naming with content hash for cache busting
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "";
          const ext = name.split(".").pop() || "";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
      },
    },
    // Increase chunk size warning limit slightly
    chunkSizeWarningLimit: 500,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Report compressed size
    reportCompressedSize: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "lucide-react"],
    exclude: [], // Add heavy optional deps here if needed
  },
  server: {
    strictPort: false,
  },
});
