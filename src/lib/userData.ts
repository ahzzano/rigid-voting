import { fail, redirect, type Cookies } from "@sveltejs/kit";
import type { User } from "./db/schema";
import { validateSessionToken } from "./sessions";

export async function setUserData(cookies: Cookies, user: User) {
    cookies.set('user', JSON.stringify(user), {
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    })
}

export function readUserData(cookies: Cookies): User | null {
    const data = cookies.get('user')
    if (data) {
        return JSON.parse(data)
    }
    return null
}

export async function removeUserData(cookies: Cookies) {
    cookies.set('user', "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/"
    })
}

export async function getLoginInfo(cookies: Cookies): Promise<User> {
    const token = cookies.get("sessionToken")
    if (token == null) {
        throw redirect(303, '/login')
    }

    const valid = await validateSessionToken(token)
    if (valid.session == null) {
        throw redirect(303, '/login')
    }

    const userData = readUserData(cookies)
    if (userData == null) {
        throw fail(404)
    }

    return userData
}
