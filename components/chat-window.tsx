"use client"

import { useState, useEffect } from "react"

import { Card } from "@/components/ui/card"

import {

    MessageScrollerProvider,

} from "@/components/ui/message-scroller"
import { ChatBox } from "@/components/chat-box"
import { ChatMessages } from "./chat-messages"

export interface ChatMessageItem {
    id: string
    role: "user" | "assistant" | "system"
    content: string
}

export interface ChatDocument {
    name: string,
    doc_type: string,
    download_url: string | null
}

interface ChatWindowProps {
    chatId?: string | null
    initialMessages?: ChatMessageItem[],
    documents?: ChatDocument[]
}

export function ChatWindow({ chatId = null, initialMessages = [], documents = [] }: ChatWindowProps) {
    const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages)

    useEffect(() => {
        setMessages(initialMessages)
    }, [chatId])

    return (
        <MessageScrollerProvider>
            <div className="relative flex h-full min-h-0 w-full flex-col gap-4">
                <Card className="mx-auto flex h-full min-h-0 w-full flex-col gap-0 overflow-hidden border-none shadow-none bg-transparent">
                    <ChatMessages messages={messages} />

                    <ChatBox chatId={chatId} setMessages={setMessages} documents={documents} />
                </Card>
            </div>
        </MessageScrollerProvider>
    )
}
