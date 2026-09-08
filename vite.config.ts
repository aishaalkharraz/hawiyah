// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: [
        // mongodb driver deps (tr46/whatwg-url) clash with the Worker build shims;
        // ASCII hostnames + native URL are enough for the Atlas connection string.
        { find: "tr46", replacement: fileURLToPath(new URL("./src/lib/mongo-stubs/tr46.ts", import.meta.url)) },
        { find: "whatwg-url", replacement: fileURLToPath(new URL("./src/lib/mongo-stubs/whatwg-url.ts", import.meta.url)) },
      ],
    },
  },
});
