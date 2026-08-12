import { defineConfig } from "astro/config";
import markdoc from "@astrojs/markdoc";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";

const enableLocalAdmin =
  !process.argv.includes("build") &&
  !process.argv.includes("preview") &&
  process.env.SKIP_KEYSTATIC !== "true";

export default defineConfig({
  integrations: [
    react(),
    markdoc(),
    ...(enableLocalAdmin ? [keystatic()] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
