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

export const userInfos = pgTable('userInfo', {
    userId: serial('user_id')
        .primaryKey()
        .references(() =>
            users.id
        ),
    firstName: text('firstName'),
    lastName: text('lastName')
})

export const polls = pgTable('polls', {
    id: serial('poll_id')
        .primaryKey(),
    owner: serial('owner_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    pollname: text('poll_name').notNull(),
    open: boolean('open')
        .default(true),
    created_at: timestamp('created_at',
        {
            mode: "date",
            withTimezone: true
        }).defaultNow()
})

export const questions = pgTable('questions', {
    id: serial('id').primaryKey(),
    poll: serial('poll_id')
        .references(() => polls.id, { onDelete: 'cascade' })
        .notNull(),
    text: text('question_text'),
    order: integer('order').notNull().default(0)
})

export const choices = pgTable('choices', {
    id: serial('id').primaryKey(),
    question: serial('question_id')
        .references(() => questions.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    count: integer().default(0)
})

export type Question = InferSelectModel<typeof questions> & {
    choices: Choice[]
}
export type User = InferSelectModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>

export type Poll = InferSelectModel<typeof polls> & {
    questions: Question[]
}

export type UserInfo = InferSelectModel<typeof userInfos>
export type Choice = InferSelectModel<typeof choices>
