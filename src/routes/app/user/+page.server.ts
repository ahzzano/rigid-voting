import { db } from "$lib/db";
import { userInfos } from "$lib/db/schema";
import { getLoginInfo, readUserData } from "$lib/userData";
import { getUserInfo } from "$lib/users";
import type { Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm/pg-core/expressions";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const userData = await getLoginInfo(cookies)

    const userInfo = await getUserInfo(userData.id)
    return { userInfo: userInfo, user: userData }
}

export const actions = {
    delete: async ({ cookies }) => {
        const user = readUserData(cookies)
        if (user == null) {
            return null
        }

        await db.delete(userInfos).where(eq(userInfos.userId, user.id))

    },
    insert: async ({ request, cookies }) => {
        const formData = await request.formData()

        const user = readUserData(cookies)
        if (user == null) {
            return null
        }

        const data = {
            firstName: String(formData.get('firstName')),
            lastName: String(formData.get('lastName')),
            userId: user.id
        }


        await db.insert(userInfos).values(data)
    },
    update: async ({ request, cookies }) => {
        const formData = await request.formData()

        const user = readUserData(cookies)
        if (user == null) {
            return null
        }

        const data = {
            firstName: String(formData.get('firstName')),
            lastName: String(formData.get('lastName')),
        }

        await db.update(userInfos)
            .set(data)
            .where(eq(userInfos.userId, user.id))
    }

} satisfies Actions
