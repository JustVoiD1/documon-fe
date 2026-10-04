'use client';

import { Card } from "./ui/card";
import { ChatBox } from "./chat-box";
import { ChatMessages } from "./chat-messages";
import useChatContext from "@/hooks/use-chat-context";
import { MessageScrollerProvider } from "./ui/message-scroller";

export function ChatWindow() {
    const {
        messages,
        documents,
    } = useChatContext();

    return (
        <MessageScrollerProvider>
            <div className="relative flex h-full min-h-0 w-full flex-col gap-4 bg-background">
                <Card className="mx-auto flex h-full min-h-0 w-full flex-col gap-0 overflow-hidden border-none bg-background shadow-none">
                    <ChatMessages messages={messages} />
                    <ChatBox />
                </Card>
            </div>
        </MessageScrollerProvider>
    )
}
