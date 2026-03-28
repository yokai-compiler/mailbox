// @ts-check
import { defineConfig, envField } from "astro/config";
import { loadEnv } from "vite";

import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
      CF_HOSTNAME: envField.string({
        context: "server",
        access: "secret",
        optional: false,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [process.env.CF_HOSTNAME || "localhost"],
    },
  },

  adapter: node({
    mode: "standalone",
  }),
});
