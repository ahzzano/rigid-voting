import { db } from "$lib/db/database"
import { polls, questions } from "$lib/db/schema"
import { readUserData } from "$lib/userData"
import { fail } from "@sveltejs/kit"
import { and, eq } from "drizzle-orm/pg-core/expressions"

export async function load({ params, cookies }) {
    const { poll } = params
    const userData = readUserData(cookies)
    if (userData == null) {
        throw fail(404)
    }

    const pollId = poll
    const pollResult = await db.select({
        pollname: polls.pollname,
        open: polls.open,
        questions: questions
    })
        .from(polls)
        .where(
            and(
                eq(polls.owner, userData?.id),
                eq(polls.id, pollId))
        )
        .fullJoin(
            questions,
            eq(questions.poll, pollId)
        )


    return { ...pollResult[0] }
}
