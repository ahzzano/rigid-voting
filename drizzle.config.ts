import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: ".env" })

export default defineConfig({
    dialect: 'postgresql',
    schema: "./src/lib/db/schema.ts",
    out: "./supabase/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
})
