import { useContext } from "react"
import { ChatContext, ChatContextType } from "@/app/context/chat-context"

export default function useChatContext(): ChatContextType {
    const context = useContext(ChatContext)

    if (!context) {
        throw new Error("useChatContext must be used within a ChatProvider")
    }

    return context
}