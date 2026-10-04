import { ChatMessageItem } from "@/types";
import { CardContent } from "./ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { IconMessageCircle } from "@tabler/icons-react";
import { MessageAnimated } from "./message-animated";
import { MessageScroller } from "./ui/message-scroller";
import { MessageScrollerButton } from "./ui/message-scroller";
import { MessageScrollerContent } from "./ui/message-scroller";
import { MessageScrollerViewport } from "./ui/message-scroller";
import { Shimmer } from "./shimmer";

export function ChatMessages({ messages }: { messages: ChatMessageItem[] }) {

    return <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        {messages.length === 0 ? (
            <Empty className="h-full flex flex-col items-center justify-center">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <IconMessageCircle className="h-10 w-10 text-primary" />
                    </EmptyMedia>
                    <EmptyTitle>Start a Conversation</EmptyTitle>
                    <EmptyDescription>
                        Ask questions or upload documents for intelligent analysis.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        ) : (
            <MessageScroller>
                <MessageScrollerViewport>
                    <MessageScrollerContent
                        className="p-4 space-y-4"
                    >
                        {messages.map((message, index) => (
                            <MessageAnimated
                                key={message.id}
                                message={message}
                                scrollAnchor={index === messages.length - 2}
                            />
                        ))}

                        <Shimmer />

                    </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
            </MessageScroller>
        )}
    </CardContent>
}