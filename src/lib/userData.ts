import type { Cookies } from "@sveltejs/kit";
import type { User } from "./db/schema";

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
