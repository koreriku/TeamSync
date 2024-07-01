import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { VitePluginFonts } from "vite-plugin-fonts"; // 追加
import Markdown from "vite-plugin-vue-markdown";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    VitePluginFonts({
      google: {
        families: ["Shantell Sans"],
      },
    }),
    Markdown(),
  ],
});
