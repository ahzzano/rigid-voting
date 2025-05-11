import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email'),
    password: text('password')
})

export const sessions = pgTable('sessions', {
    id: serial('id').notNull().primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id),
    expiresAt: timestamp('expires_at', {
        mode: "date",
        withTimezone: true
    }).notNull()
})

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>
