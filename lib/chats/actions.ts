"use server"
import { authenticate } from "@/app/auth/user/actions";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import axios from "axios"
import { ChatDocumentItem } from "@/types";
const BACKEND_URL = process.env.BACKEND_URL;
type ResponseType = {
    success: true,
    message: string,
} | {
    success: false,
    error: string
}
export async function getChats() {
    const user = await authenticate()
    if (!user) return [];
    const chats = await prisma.chat.findMany({
        where: {
            creator_id: user.id
        },
        select: {
            id: true,
            title: true,
            is_pinned: true,
            updated_at: true,
        },
        orderBy: {
            updated_at: 'desc'
        }
    });

    return chats;
}

export async function getPinnedChats() {
    const user = await authenticate();
    if (!user) return [];

    const chats = await prisma.chat.findMany({
        where: {
            creator_id: user.id,
            is_pinned: true
        },
        select: {
            id: true,
            title: true,
        },
        orderBy: {
            updated_at: 'desc'
        }
    });
    return chats;
}

export async function getChatById(chatId: string) {
    const user = await authenticate();
    if (!user) return null;

    const chat = await prisma.chat.findFirst({
        where: {
            id: chatId,
            creator_id: user.id,
        },
        include: {
            messages: {
                orderBy: {
                    created_at: 'asc'
                }
            }
        }
    });

    return chat;
}

export async function createNewChat(customTitle?: string) {
    const user = await authenticate();

    const chatCount = await prisma.chat.count({
        where: { creator_id: user.id }
    });

    let title = customTitle;
    if (!title) {
        if (chatCount === 0) {
            title = "My First Chat";
        } else {
            title = "New Chat";
        }
    }

    const chat = await prisma.chat.create({
        data: {
            id: crypto.randomUUID(),
            creator_id: user.id,
            title: title
        }
    });

    revalidatePath("/chat");
    return chat;
}

export async function sendMessageAndGetAIResponse({
    chatId,
    query
}: {
    chatId?: string | null;
    query: string;
}) {
    const user = await authenticate();

    let currentChatId = chatId;
    let chatTitle = "";

    // If no chat ID, check total user chats or create a new chat session
    if (!currentChatId) {
        const chatCount = await prisma.chat.count({
            where: { creator_id: user.id }
        });

        chatTitle = chatCount === 0 ? "My First Chat" : (query.slice(0, 30) + (query.length > 30 ? "..." : ""));

        const newChat = await prisma.chat.create({
            data: {
                id: crypto.randomUUID(),
                creator_id: user.id,
                title: chatTitle
            }
        });
        currentChatId = newChat.id;
    } else {
        await prisma.chat.update({
            where: { id: currentChatId },
            data: { updated_at: new Date() }
        }).catch(() => { });
    }

    // Save user message to PostgreSQL
    const userMessage = await prisma.message.create({
        data: {
            id: crypto.randomUUID(),
            chat_id: currentChatId,
            role: "user",
            content: query
        }
    });

    let aiResponseText = "";
    try {
        const response = await axios.post(`${BACKEND_URL}/api/query`, {

            query: query,
            chat_id: currentChatId,
            top_k: 3

        });

        if (response.data.error) {
            const errText = await response.data.error;
            console.error("Backend /query error:", response.status, errText);
            aiResponseText = `Unable to get response`;
        } else {
            const resData = await response.data;
            aiResponseText = resData.answer || resData.response || resData.result || resData.reply || resData.message || (typeof resData === "string" ? resData : JSON.stringify(resData));
        }
    } catch (err: any) {
        console.error("Fetch error calling backend /query:", err);
        aiResponseText = `Something Went Wrong`;
    }

    // Save AI assistant message to PostgreSQL
    const assistantMessage = await prisma.message.create({
        data: {
            id: crypto.randomUUID(),
            chat_id: currentChatId,
            role: "assistant",
            content: aiResponseText
        }
    });

    revalidatePath(`/chat/${currentChatId}`);
    revalidatePath("/chat");

    return {
        chatId: currentChatId,
        userMessage: {
            id: userMessage.id,
            role: userMessage.role,
            content: userMessage.content,
            created_at: userMessage.created_at
        },
        assistantMessage: {
            id: assistantMessage.id,
            role: assistantMessage.role,
            content: assistantMessage.content,
            created_at: assistantMessage.created_at
        },
        chatTitle
    };
}

export async function sendMessage(formData: FormData) {
    const user = await authenticate();
    const query = formData.get('query') as string;
    const chatId = formData.get('chatId') as string


    const res = await sendMessageAndGetAIResponse({
        chatId,
        query
    })

    return res




}

export async function uploadDocument(formData: FormData): Promise<ChatDocumentItem | null> {
    const user = await authenticate();

    const file = formData.get("file") as File;
    const chatId = formData.get("chat_id") as string | null;

    if (!file || !(file instanceof File)) {
        console.log("Error: no valid document to upload")
        return null
    }

    try {
        const backendFormData = new FormData();
        backendFormData.append("file", file);
        if (chatId) backendFormData.append("chat_id", chatId);
        backendFormData.append("uploaded_by", user.id);

        const response = await axios.post(`${BACKEND_URL}/api/documents/upload`, backendFormData);

        if (response.data.error) {
            const errDetail = await response.data.error;
            console.error("Upload error from backend:", response.status, errDetail);
            return null
        }


        if (chatId) {
            revalidatePath(`/chat/${chatId}`);
        }

        return response.data.document;
    } catch (err: any) {
        console.error("Document upload request failed:", err);
        return null;
    }
}

export async function deleteChat(chatId: string) {
    const user = await authenticate();
    if (!user) return { success: false, error: 'Could not delete chat' };

    try {
        const isOriginalUser = await prisma.chat.findUnique({
            where: {
                id: chatId,
                creator_id: user.id
            }
        })
        if (!isOriginalUser) {
            return { success: false, error: 'You are not authorized to delete this chat' };
        }


        await prisma.chat.delete({
            where: {
                id: chatId,
                creator_id: user.id
            }
        });

        const response = await axios.delete(
            `${BACKEND_URL}/api/documents`,
            {
                data: {
                    chat_id: chatId
                },
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        if (response.data.success) {
            revalidatePath("/chat");
            return { success: true };
        }
        else {
            return { success: false, error: response.data.error };
        }
    } catch (err) {
        console.error("Delete chat error:", err);
        return { success: false, error: 'Error deleting chat' };
    }
}


export async function renameChat(chatId: string, newTitle: string) {
    const user = await authenticate();
    if (!user) return { success: false, error: 'Could not rename chat' };

    const chat = await prisma.chat.findUnique({
        where: {
            id: chatId,
            creator_id: user.id
        }
    })
    if (!chat) {
        return { success: false, error: 'Chat not found' };
    }
    if (newTitle === chat.title) {
        return { success: false, error: 'New title is same as old title' };
    }

    const updatedChat = await prisma.chat.update({
        where: {
            id: chatId,
            creator_id: user.id
        },
        data: {
            title: newTitle
        }
    })

    if (!updatedChat) {
        return { success: false, error: 'Failed to rename chat' };
    }

    revalidatePath(`/chat/${chatId}`);
    revalidatePath("/chat");

    return { success: true, chat: updatedChat };

}
// get the list of documents {doc_type: str, name, download_url}

export async function getDocumentsByChatId(chat_id: string) {
    const user = await authenticate()
    try {
        const documents = await prisma.document.findMany({
            where: {
                chat_id: chat_id,
                uploaded_by: user.id
            },
            select: {
                id: true,
                doc_type: true,
                name: true,
                download_url: true
            }
        })
        return documents;
    } catch (err: any) {
        console.error("Document list request failed:", err);
        return []
    }
}

export async function getMessagesByChatId(chat_id: string) {
    try {

        const messages = await prisma.message.findMany({
            where: {
                chat_id: chat_id,
            },
            select: {
                id: true,
                role: true,
                content: true,
                created_at: true
            }
        })
        return messages
    } catch (err) {
        console.log(err)
        return []

    }
}