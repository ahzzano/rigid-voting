import { readUserData } from "$lib/userData";

export async function load({ cookies }) {
    const userData = readUserData(cookies)
    if (!userData) {
        return
    }
}
