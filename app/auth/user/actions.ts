"use server"
import { auth } from "@/lib/auth/server"
import { redirect } from "next/navigation";

// get user details

export async function getUser() {
    try {

        const session = await auth.getSession()
        if (!session || !session.data || !session.data.user) {
            return null;
        }

        const user = session.data.user;

        return { id: user.id, name: user.name, email: user.email };
    }
    catch (err) {
        console.error("getUser error:", err);
        return null;
    }
}


export async function authenticate() {
    const user = await getUser();
    if (!user) return redirect('/auth/sign-in');

    return user
}