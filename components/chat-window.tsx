"use client"

import { useContext } from "react"
import { Card } from "@/components/ui/card"
import { MessageScrollerProvider } from "@/components/ui/message-scroller"
import { ChatBox } from "@/components/chat-box"
import { ChatMessages } from "./chat-messages"
import { ChatContext, ChatProvider, ChatMessageItem, ChatDocument } from "@/app/context/chat-context"
import useChatContext from "@/hooks/use-chat-context"

export type { ChatMessageItem, ChatDocument }

function ChatWindowInner() {
    const {
        messages,
        documents,
    } = useChatContext();

    return (
        <MessageScrollerProvider>
            <div className="relative flex h-full min-h-0 w-full flex-col gap-4">
                <Card className="mx-auto flex h-full min-h-0 w-full flex-col gap-0 overflow-hidden border-none shadow-none bg-transparent">
                    <ChatMessages messages={messages} />
                    <ChatBox documents={documents} />
                </Card>
            </div>
        </MessageScrollerProvider>
    )
}

export function ChatWindow() {
    const existingContext = useContext(ChatContext);

    if (existingContext) {
        return <ChatWindowInner />;
    }

    return (
        <ChatProvider>
            <ChatWindowInner />
        </ChatProvider>
    );
}

