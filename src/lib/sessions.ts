import { type Session, sessions } from "./db/schema";
import { db } from "./db/database";

import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCase, encodeHexLowerCase } from "@oslojs/encoding";
import { users, type User } from "./db/schema";
import { eq } from "drizzle-orm/pg-core/expressions";
import type { Cookies } from "@sveltejs/kit";

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCase(bytes)
    return token
}

export async function createSession(token: string, userId: number): Promise<Session> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }

    await db.insert(sessions).values(session)
    return session
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    // TODO
    const result = await db
        .select({ user: users, session: sessions })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, token));

    if (result.length < 1) {
        return { session: null, user: null }
    }

    const { user, session } = result[0]
    // TODO: add expiration checks
    if (session.expiresAt.getDate() <= Date.now()) {
        return { session: null, user: null }
    }

    return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId))
}

export async function invalidateAllSessions(userId: number): Promise<void> {
    // TODO
    await db.delete(sessions).where(eq(sessions.userId, userId))
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

export async function setSessionToken(cookies: Cookies, session: Session) {
    cookies.set("sessionToken", session.id, {
        httpOnly: true,
        sameSite: "lax",
        expires: session.expiresAt,
        path: "/"
    })
}
