"use server"
import { getUser } from "@/app/auth/user/actions";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";

// get chats with prisma
export default async function getChats() {
    const user = await getUser()
    if (!user) redirect("/auth/sign-in")

    const dbUser = await prisma.user.findFirst({
        where: {
            name: user.name,
            email: user.email
        }
    })
    if (!dbUser) {
        return []
    }
    const chats = await prisma.chat.findMany({
        where: {
            creator_id: dbUser.id
        },
        select: {
            id: true,
            title: true,
        },
        orderBy: {
            updated_at: 'desc' // Orders by descending order (newest first)
        },
        take: 3 // 

    })

    return chats
}