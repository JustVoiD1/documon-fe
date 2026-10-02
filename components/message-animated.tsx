"use client"

import * as React from "react"
import { cn } from "cn"
import { MessageScrollerItem } from "@/components/ui/message-scroller"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { getMessageText } from "@/lib/ai"

interface MessageAnimatedProps extends React.ComponentProps<typeof MessageScrollerItem> {
    message: any
    scrollAnchor?: boolean
}

function FormattedText({ text }: { text: string }) {
    if (!text) return null

    const paragraphs = text.split("\n\n")

    return (
        <div className="space-y-2.5">
            {paragraphs.map((paragraph, pIdx) => {
                const parts = paragraph.split(/(`[^`]+`)/g)

                return (
                    <p key={pIdx} className="leading-relaxed">
                        {parts.map((part, idx) => {
                            if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
                                return (
                                    <code
                                        key={idx}
                                        className="mx-0.5 rounded bg-muted-foreground/15 px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-foreground border border-border/40"
                                    >
                                        {part.slice(1, -1)}
                                    </code>
                                )
                            }
                            return <span key={idx}>{part}</span>
                        })}
                    </p>
                )
            })}
        </div>
    )
}

export function MessageAnimated({
    message,
    scrollAnchor = false,
    className,
    ...props
}: MessageAnimatedProps) {
    const isUser = message?.role === "user"
    const text = getMessageText(message)

    return (
        <MessageScrollerItem
            scrollAnchor={scrollAnchor}
            className={cn("animate-in fade-in-0 slide-in-from-bottom-2 duration-300", className)}
            {...props}
        >
            <Message align={isUser ? "end" : "start"}>

                <MessageContent>
                    <Bubble variant={isUser ? "default" : "outline"} align={isUser ? "end" : "start"}>
                        <BubbleContent className={cn("px-4 py-3 text-sm shadow-xs", isUser ? "rounded-2xl rounded-tr-xs" : "rounded-2xl rounded-tl-xs bg-muted/40 border-none")}>
                            <FormattedText text={text} />
                        </BubbleContent>
                    </Bubble>
                </MessageContent>
            </Message>
        </MessageScrollerItem>
    )
}
