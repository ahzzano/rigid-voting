import { db } from "$lib/db"
import { choices, questions } from "$lib/db/schema"
import { readUserData } from "$lib/userData"
import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { getPoll } from "$lib/services/questions"
import { ChoiceSchema, QuestionSchema } from "$lib/zodSchemas"

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

        if (!poll) {
            throw fail(404)
        }

        const formData = await request.formData()

        const questionData = {
            text: String(formData.get("question")),
            poll: Number(poll),
        }

        const sanitizedData = QuestionSchema.safeParse(questionData)

        if (!sanitizedData.success) {
            throw fail(404)
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

        const sanitizedData = ChoiceSchema.safeParse(choiceData)

        if (!sanitizedData.success) {
            throw fail(404)
        }

        const { data } = sanitizedData
        await db.insert(choices).values(data)

        redirect(303, `/app/${poll}`)
    }

} satisfies Actions
