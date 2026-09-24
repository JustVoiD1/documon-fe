import { MessageScroller } from "./ui/message-scroller"
import { MessageScrollerButton } from "./ui/message-scroller"
import { MessageScrollerContent } from "./ui/message-scroller"
import { MessageScrollerViewport } from "./ui/message-scroller"
import { MessageAnimated } from "./message-animated"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "./ui/empty"
import { IconLoader2, IconMessageCircle } from "@tabler/icons-react"
import { CardContent } from "./ui/card"
import { getChatById, getMessagesByChatId } from "@/lib/chats/actions"
import { prisma } from "@/lib/prisma"

export async function ChatMessages({ chatId, isBusy }: { chatId: string | null, isBusy: boolean }) {
    if (!chatId) return;
    const messages = await getMessagesByChatId(chatId)


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
                        aria-busy={isBusy}
                        className="p-4 space-y-4"
                    >
                        {messages.map((message) => (
                            <MessageAnimated
                                key={message.id}
                                message={message}
                                scrollAnchor={message.role === "user"}
                            />
                        ))}

                        {isBusy && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground italic px-2 py-1">
                                <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                                <span>AI is thinking...</span>
                            </div>
                        )}
                    </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
            </MessageScroller>
        )}
    </CardContent>
}