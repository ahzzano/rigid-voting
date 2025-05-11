import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({path: ".env"})

export default config = defineConfig({
    dialect: 'postgresql',
    schema: "./src/db/schema.ts",
    out: "./supabase/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
})
