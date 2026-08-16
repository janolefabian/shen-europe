import { defineConfig } from "astro/config";
import markdoc from "@astrojs/markdoc";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";

const enableLocalAdmin =
  !process.argv.includes("build") &&
  !process.argv.includes("preview") &&
  process.env.SKIP_KEYSTATIC !== "true";

const localInstrumentIntake = () => ({
  name: "shen-europe:local-instrument-intake",
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      if (command !== "dev") return;

      injectRoute({
        pattern: "/admin",
        entrypoint: new URL(
          "./src/local-admin/dashboard.astro",
          import.meta.url,
        ),
        prerender: false,
      });
      injectRoute({
        pattern: "/admin/instruments/new",
        entrypoint: new URL(
          "./src/local-admin/instrument-intake.astro",
          import.meta.url,
        ),
        prerender: false,
      });
      injectRoute({
        pattern: "/admin/api/instruments",
        entrypoint: new URL(
          "./src/local-admin/create-instrument.ts",
          import.meta.url,
        ),
        prerender: false,
      });
    },
  },
});

export default defineConfig({
  integrations: [
    react(),
    markdoc(),
    ...(enableLocalAdmin ? [keystatic(), localInstrumentIntake()] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
