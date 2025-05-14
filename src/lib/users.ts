import { eq } from "drizzle-orm";
import { db } from "$lib/db";
import { userInfos } from "./db/schema";

export async function getUserInfo(userId: number) {
    const res = await db.select({ userInfo: userInfos })
        .from(userInfos)
        .where(eq(userInfos.userId, userId))

    if (res.length < 1) {
        return null
    }

    return res[0].userInfo
}
