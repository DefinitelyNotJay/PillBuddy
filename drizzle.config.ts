import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: "postgresql://cm1ptd9uk000gbsmn5hx81rne:wtqIYUe7Ds9wduBvjv1xjk7z@161.246.127.24:9056/cm1ptd9ul000ibsmnhk7l41iw"
  }
});