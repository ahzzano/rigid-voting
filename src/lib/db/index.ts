import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { DATABASE_URL } from '$env/static/private'


// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(DATABASE_URL, { prepare: false })
export const db = drizzle(client);
