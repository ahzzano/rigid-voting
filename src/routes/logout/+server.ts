import { invalidateSession } from "$lib/sessions"
import { removeUserData } from "$lib/userData"
import { redirect } from "@sveltejs/kit"
import type { RequestEvent } from "../$types"

export async function GET({ cookies }: RequestEvent) {
    const token = cookies.get("sessionToken")
    if (!token) {
        redirect(302, '/')
    }
    invalidateSession(token)

    cookies.set("sessionToken", "", {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(0),
        path: "/"
    })

    removeUserData(cookies)

    throw redirect(302, '/')
}
