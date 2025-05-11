import { invalidateAllSessions, invalidateSession } from "$lib/sessions"
import { redirect } from "@sveltejs/kit"

export async function GET({ cookies }) {
    invalidateSession(cookies.get("sessionToken"))
    console.log(cookies)

    cookies.set("sessionToken", "", {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(0),
        path: "/"
    })


    throw redirect(302, '/')
}
