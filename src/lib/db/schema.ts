import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { InferSelectModel } from "drizzle-orm";


export const users = pgTable('users', {
    id: serial('id')
        .primaryKey(),
    email: text('email'),
    password: text('password')
})

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    userId: serial('user_id')
        .notNull()
        .references(() => users.id),
    expiresAt: timestamp('expires_at', {
        mode: "date",
        withTimezone: true
    }).notNull()
})

export const userInfo = pgTable('userInfo', {
    userId: serial('user_id')
        .primaryKey()
        .references(() =>
            users.id
        ),
    firstName: text('firstName'),
    lastName: text('lastName')
})

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>
