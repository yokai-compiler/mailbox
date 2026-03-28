// @ts-check
import { defineConfig, envField } from "astro/config";

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
      TOKEN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
        default: "secret",
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
