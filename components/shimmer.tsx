'use client'
import { useChatContext } from "@/hooks/use-chat-context";
export function Shimmer() {

    const { isBusy } = useChatContext()
    return (
        isBusy && (
            <p className="shimmer text-sm text-muted-foreground">
                Generating response&hellip;
            </p>
        )
    )
}