import { db } from "$lib/db";
import { sessions, users } from "$lib/db/schema";
import { createSession, generateSessionToken, setSessionToken, validateSessionToken } from "$lib/sessions";
import { setUserData } from "$lib/userData";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm/pg-core/expressions";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get("sessionToken")
    if (token == undefined) {
        return
    }
    const { session } = await validateSessionToken(token)

    if (session != null) {
        return redirect(303, '/app')
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

        if (session.length == 0) {
            const token = generateSessionToken()
            const session = await createSession(token, userData.id)

            const { user } = await validateSessionToken(token)
            if (user) {
                setSessionToken(cookies, session)
                setUserData(cookies, user)
            }

        } else {
            const isValidSession = await validateSessionToken(session[0].session.id)
            if (isValidSession.session == null) {
                const token = generateSessionToken()
                const session = await createSession(token, userData.id)
                setSessionToken(cookies, session)

            }
            else {
                const { session } = isValidSession
                setSessionToken(cookies, session)
            }

            const { user } = await validateSessionToken(session[0].session.id)
            if (user) {
                setUserData(cookies, user)
            }
        }

        redirect(303, '/app')

    }

} satisfies Actions
