import { db } from "$lib/db/database";
import { users } from "$lib/db/schema";
import { UserSchema } from "$lib/zodSchemas";
import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData()
        const user = {
            email: String(formData.get('email')),
            password: String(formData.get('password'))
        }

        const safeParse = UserSchema.safeParse(user)

        if (!safeParse.success) {
            console.log(safeParse)
            return fail(422, { issues: safeParse.error.issues })
        }

        try {
            await db.insert(users).values(user)
        }
        catch (e) {
            console.log(user)
            console.log(e)
        }
        return { success: true }
    }
} satisfies Actions
