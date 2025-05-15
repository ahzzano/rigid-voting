// src/routes/protected/+layout.server.js
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
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

