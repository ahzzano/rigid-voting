import { type Session, sessions } from "./db/schema";
import { db } from "./db/database";

import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCase, encodeHexLowerCase } from "@oslojs/encoding";
import { users, type User } from "./db/schema";
import { eq } from "drizzle-orm/pg-core/expressions";

function encodeToken(token: number, userId: number) {

}

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
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const result = await db
        .select({ user: users, session: sessions })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.id, sessionId));

    if (result.length < 1) {
        return { session: null, user: null }
    }

    const { user, session } = result[0]
    // TODO: add expiration checks

    return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delte(sessions).where(eq(sessions.id, sessionId))
}

export async function invalidateAllSessions(userId: number): Promise<void> {
    // TODO
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };
