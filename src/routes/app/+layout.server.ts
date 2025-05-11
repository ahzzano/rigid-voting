// src/routes/protected/+layout.server.js
import { redirect } from '@sveltejs/kit';

export function load({ cookies, route }) {
    try {
        const token = cookies.get("sessionToken")
        if (token == undefined) {
            redirect(303, '/login')

        }
    }
    catch (e) {
        cookies.set("token", "", { maxAge: -1, path: "/" });
        redirect(303, '/login')
    }
}

