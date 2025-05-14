import { db } from "$lib/db"
import { choices, polls, questions } from "$lib/db/schema"
import { readUserData } from "$lib/userData"
import { fail, redirect, type Actions } from "@sveltejs/kit"
import { and, eq } from "drizzle-orm/pg-core/expressions"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params, cookies }) => {
    const { poll } = params
    const userData = readUserData(cookies)
    if (userData == null) {
        throw fail(404)
    }

    const pollId = poll
    const pollQuery = await db.select({
        pollname: polls.pollname,
        open: polls.open,
        // questions: questions
    })
        .from(polls)
        .where(
            and(
                eq(polls.owner, userData?.id),
                eq(polls.id, pollId))
        )

    const result = pollQuery[0]

    const quesetionQuery = await db
        .select({
            question: questions.question,
            order: questions.order,
            choices: choices,
            id: questions.id
        })
        .from(questions)
        .leftJoin(choices, eq(choices.question, questions.id))
        .where(eq(questions.poll, pollId))


    let questionsMap = new Map()

    for (const row of quesetionQuery) {
        if (!questionsMap.has(row.id)) {
            questionsMap.set(row.id, {
                id: row.id,
                question: row.question,
                choices: [],
            });
        }
        if (row.choices) {
            console.log(questionsMap.get(row.id))
            questionsMap.get(row.id).choices.push({
                id: row.choices.id,
                content: row.choices.content
            });
        }
    }

    return { ...result, questions: Array.from(questionsMap.values()) }
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
            question: String(formData.get("question")),
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
