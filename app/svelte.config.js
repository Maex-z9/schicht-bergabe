import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // Vercel-Adapter; Edge-Runtime möglich, wir bleiben aber auf Node
    // damit Postgres/SSR-Sessions ohne Sonderfälle funktionieren.
    adapter: adapter({ runtime: "nodejs20.x" }),
  },
};

export default config;
