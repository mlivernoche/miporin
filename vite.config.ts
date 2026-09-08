import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp run check",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
    tasks: {
      dev: {
        command: "vp dev --host",
        cwd: "./apps/main",
        cache: false,
      },
      check: {
        command: "vp run check",
        cwd: "./apps/main",
        cache: false,
      },
    },
  },
});
