"use server"
import { auth } from "@/lib/auth/server"

// get user details

export async function getUser() {
    const session = await auth.getSession()
    if (!session || !session.data || !session.data.user) {
        return null;
    }

    const user = session.data.user;

    return { name: user.name, email: user.email };
}
