import { db } from "$lib/db/database";
import { polls } from "$lib/db/schema";
import { readUserData } from "$lib/userData";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm/pg-core/expressions";

export async function load({ cookies }) {
    const userData = readUserData(cookies)

    if (!userData) {
        return fail(300)
    }

    const userPolls = await db
        .select()
        .from(polls)
        .where(eq(polls.owner, userData.id));

    return {
        polls: userPolls
    }
}

export const actions = {
    add_poll: async ({ request, cookies }) => {
        const userData = readUserData(cookies)
        if (!userData) {
            return fail(300)
        }

        const formData = await request.formData()

        const pollData = {
            owner: userData.id,
            pollname: String(formData.get('pollName'))
        }

        await db.insert(polls).values(pollData)
        redirect(303, '/app')
    }

} satisfies Actions
