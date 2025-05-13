import { invalidateSession } from "$lib/sessions"
import { removeUserData } from "$lib/userData"
import { redirect } from "@sveltejs/kit"

export async function GET({ cookies }) {
    invalidateSession(cookies.get("sessionToken"))

    cookies.set("sessionToken", "", {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(0),
        path: "/"
    })

    removeUserData(cookies)

    throw redirect(302, '/')
}
