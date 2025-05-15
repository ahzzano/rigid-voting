import { db } from "$lib/db"
import { polls, questions, choices } from "$lib/db/schema"
import type { Poll, Question } from "$lib/db/schema"
import { and, eq } from "drizzle-orm/pg-core/expressions"

export async function getPoll(pollId: number, userId: number): Promise<Poll> {
    const poll = (await db.select({
        id: polls.id,
        name: polls.pollname,
        open: polls.open,
        created_at: polls.created_at
    })
        .from(polls)
        .where(
            and(
                eq(polls.owner, userId),
                eq(polls.id, pollId))
        ))[0]


    const quesetionQuery = await db
        .select({
            text: questions.text,
            order: questions.order,
            choices: choices,
            id: questions.id
        })
        .from(questions)
        .leftJoin(choices, eq(choices.question, questions.id))
        .where(
            eq(questions.poll, pollId)
        )


    let questionsMap: Map<number, Question> = new Map()

    for (const row of quesetionQuery) {
        if (!questionsMap.has(row.id)) {
            questionsMap.set(row.id, {
                id: row.id,
                poll: poll.id,
                text: row.text,
                order: row.order,
                choices: []
            });
        }
        if (row.choices) {
            questionsMap.get(row.id)?.choices.push({
                id: row.choices.id,
                content: row.choices.content,
                count: 0,
                question: row.id
            });
        }
    }

    return {
        id: poll.id,
        pollname: poll.name,
        open: poll.open,
        created_at: poll.created_at,
        owner: userId,
        questions: Array.from(questionsMap.values())
    }

}
