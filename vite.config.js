import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readdirSync, readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Virtual module: `virtual:screenshots`
// Returns a sorted array of filenames from the /screenshots/ folder.
// Automatically picks up new images — no manual updates needed.
function screenshotsPlugin() {
  const virtualId = "virtual:screenshots";
  return {
    name: "vite-plugin-screenshots",
    resolveId(id) {
      if (id === virtualId) return "\0" + virtualId;
    },
    load(id) {
      if (id === "\0" + virtualId) {
        const dir = resolve(__dirname, "screenshots");
        const files = readdirSync(dir)
          .filter((f) => /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(f))
          .sort();
        return `export default ${JSON.stringify(files)}`;
      }
    },
  };
}

// HTML partials plugin — processes <!-- @include path --> directives in HTML files.
// Partials live in docs-src/_partials/ and are resolved relative to docs-src/.
function htmlIncludePlugin() {
  return {
    name: "vite-plugin-html-include",
    enforce: "pre",
    transformIndexHtml(html) {
      return html.replace(/<!--\s*@include\s+(.+?)\s*-->/g, (_, file) => {
        const filePath = resolve(__dirname, "docs-src", file.trim());
        return readFileSync(filePath, "utf-8");
      });
    },
  };
}

export default defineConfig({
  root: resolve(__dirname, "docs-src"),
  base: "/docs/",
  plugins: [htmlIncludePlugin(), screenshotsPlugin()],
  build: {
    outDir: resolve(__dirname, "docs"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "docs-src/index.html"),
        features: resolve(__dirname, "docs-src/features/index.html"),
        usage: resolve(__dirname, "docs-src/usage/index.html"),
        output_page: resolve(__dirname, "docs-src/output/index.html"),
        faq: resolve(__dirname, "docs-src/faq/index.html"),
      },
    },
  },
  // Note: /logos/ and /screenshots/ are served from the site root in production.
  // They won't show in the Vite dev server — run docs:build and check the deployed site.
});
