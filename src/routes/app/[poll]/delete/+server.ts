import { db } from "$lib/db";
import { polls } from "$lib/db/schema";
import { getPoll } from "$lib/services/questions";
import { getLoginInfo } from "$lib/userData";
import { redirect, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm/pg-core/expressions";

export const POST: RequestHandler = async ({ cookies, params }) => {
    await getLoginInfo(cookies)

    const currentPoll = Number(params.poll)

    await db.delete(polls)
        .where(
            eq(polls.id, currentPoll)
        )

    return redirect(300, '/app')
}
