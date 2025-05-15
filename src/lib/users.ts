import { eq } from "drizzle-orm";
import { db } from "$lib/db";
import { userInfos, type UserInfo } from "./db/schema";

export async function getUserInfo(userId: number): Promise<UserInfo | null> {
    const res = await db.select()
        .from(userInfos)
        .where(eq(userInfos.userId, userId))

    if (res.length < 1) {
        return null
    }

    return res[0]
}

