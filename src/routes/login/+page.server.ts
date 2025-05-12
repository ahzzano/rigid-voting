import { db } from "$lib/db/database";
import { sessions, users } from "$lib/db/schema";
import { createSession, generateSessionToken, validateSessionToken } from "$lib/sessions";
import { UserSchema } from "$lib/zodSchemas";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm/pg-core/expressions";

export const load = async ({ cookies }) => {
    const token = cookies.get("sessionToken")
    if (token == undefined) {
        return
    }
    const sess = await validateSessionToken(token)

    console.log(sess)
    if (sess.session != null) {
        redirect(303, '/app')
    }

}
export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData()
        const user = {
            email: String(formData.get('email')),
            password: String(formData.get('password'))
        }

        const passwordHash = sha256(new TextEncoder().encode(user.password))
        const hexHash = encodeHexLowerCase(passwordHash)
        user.password = hexHash

        const result = await db
            .select({ user: users })
            .from(users)
            .where(
                and(
                    eq(users.password, user.password),
                    eq(users.email, user.email)
                ))

        if (result.length == 0) {
            console.log('no user')
            return fail(422, { issue: "fail" })
        }

        const userData = result[0].user

        const session = await db
            .select({ session: sessions })
            .from(sessions)
            .where(
                eq(sessions.userId, userData.id)
            )

        console.log(session)
        if (session.length == 0) {
            const token = generateSessionToken()
            const session = await createSession(token, userData.id)
            cookies.set("sessionToken", session.id, {
                httpOnly: true,
                sameSite: "lax",
                expires: session.expiresAt,
                path: "/"
            })
        } else {
            const isValidSession = await validateSessionToken(session[0].session.id)
            if (isValidSession.session == null) {
                const token = generateSessionToken()
                const session = await createSession(token, userData.id)
                cookies.set("sessionToken", session.id, {
                    httpOnly: true,
                    sameSite: "lax",
                    expires: session.expiresAt,
                    path: "/"
                })
            }
            else {
                const validSession = isValidSession.session
                cookies.set("sessionToken", validSession.id, {
                    httpOnly: true,
                    sameSite: "lax",
                    expires: validSession.expiresAt,
                    path: "/"
                })
            }
        }

        redirect(303, '/app')

    }

} satisfies Actions
