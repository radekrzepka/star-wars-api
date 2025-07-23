import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/modules/database/schema/*",
  out: "./src/modules/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
