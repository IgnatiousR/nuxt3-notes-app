import "dotenv/config";
import { defineConfig } from "drizzle-kit";
// const config = useRuntimeConfig();

export default defineConfig({
  out: "./migrations",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    // url: config.databaseUrl,
  },
});
