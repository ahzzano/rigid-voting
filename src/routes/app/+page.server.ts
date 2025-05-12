import { readUserData } from "$lib/userData";

export async function load({ cookies }) {
    console.log(readUserData(cookies))
}
