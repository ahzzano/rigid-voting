import type { User } from "$lib/db/schema";
import { readUserData } from "$lib/userData";
import { getUserInfo } from "$lib/users";
import type { Actions } from "@sveltejs/kit";

export async function load({ cookies }) {
    const userData: User = readUserData(cookies)
    console.log(userData)
    if (!userData) {
        return null
    }

    const userInfo = await getUserInfo(userData.id)
    if (userInfo == null) {
        return { userInfo: null, user: userData }
    }

    return { userInfo: userInfo, user: userData }
}

export const actions = {
    insert: async ({ request, cookies }) => {
        console.log("AA")
    },
    update: async ({ request, cookies }) => {

    }

} satisfies Actions
