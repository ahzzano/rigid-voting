import { db } from "$lib/db"
import { choices, questions } from "$lib/db/schema"
import { readUserData } from "$lib/userData"
import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { getPoll } from "$lib/services/questions"

export const load: PageServerLoad = async ({ params, cookies }) => {
    const { poll } = params
    const userData = readUserData(cookies)
    if (userData == null) {
        throw fail(404)
    }

    return await getPoll(Number(poll), userData.id)
}

export const actions = {
    add_question: async ({ request, cookies, params }) => {
        const { poll } = params
        const userData = readUserData(cookies)
        if (userData == null) {
            throw fail(404)
        }

        const formData = await request.formData()

        const questionData = {
            text: String(formData.get("question")),
            poll: poll,
        }

        await db.insert(questions).values(questionData)

        redirect(303, `/app/${poll}`)
    },

    add_choice: async ({ request, cookies, params }) => {
        const { poll } = params
        const userData = readUserData(cookies)
        if (userData == null) {
            throw fail(404)
        }

        const formData = await request.formData()

        const choiceData = {
            question: Number(formData.get('questionId')),
            content: String(formData.get('choice'))
        }

        console.log(formData.get('questionId'))
        console.log(choiceData)

        await db.insert(choices).values(choiceData)

        redirect(303, `/app/${poll}`)
    }

} satisfies Actions
