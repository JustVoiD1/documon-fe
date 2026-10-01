import { sendMessageAndGetAIResponse, uploadDocument } from "@/lib/chats/actions"
import { ChatBoxClient, ChatBoxClientProps } from "./chat-box-client"

export interface ChatBoxServerProps extends Omit<ChatBoxClientProps, "serverAction" | "uploadAction"> {
    serverAction?: typeof sendMessageAndGetAIResponse
    uploadAction?: typeof uploadDocument
}

export async function ChatBoxServer({
    chatId,
    setMessages,
    setMessage,
    onMessageSent,
    serverAction = sendMessageAndGetAIResponse,
    uploadAction = uploadDocument,
    ...props
}: ChatBoxServerProps) {
    return (
        <ChatBoxClient
            chatId={chatId}
            setMessages={setMessages}
            setMessage={setMessage}
            onMessageSent={onMessageSent}
            serverAction={serverAction}
            uploadAction={uploadAction}
            {...props}
        />
    )
}
