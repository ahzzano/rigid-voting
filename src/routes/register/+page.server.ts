import { db } from "$lib/db/database";
import { users } from "$lib/db/schema";
import { UserSchema } from "$lib/zodSchemas";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
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

        const passwordHash = sha256(new TextEncoder().encode(user.password))
        const hexHash = encodeHexLowerCase(passwordHash)

        const loginInfo = {
            email: user.email,
            password: hexHash
        }

        try {
            await db.insert(users).values(loginInfo)
        }
        catch (e) {
            console.log(user)
            console.log(e)
        }
        return { success: true }
    }
} satisfies Actions
