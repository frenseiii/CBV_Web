import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
const serverEnv = Object.fromEntries(
  Object.entries(env).filter(([k]) => !k.startsWith("VITE_")),
);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    define: {
      ...Object.fromEntries(
        Object.entries(serverEnv).map(([k, v]) => [
          `process.env.${k}`,
          JSON.stringify(v),
        ]),
      ),
    },
  },
});
