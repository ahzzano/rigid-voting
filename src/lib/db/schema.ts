import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
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

export const poll = pgTable('polls', {
    id: serial('poll_id')
        .primaryKey(),
    owner: serial('owner_id')
        .references(() => users.id)
        .notNull(),
    pollname: text('poll_name').notNull(),
    open: boolean('open')
        .default(true)
})

export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>
export type Poll = InferSelectModel<typeof poll>
