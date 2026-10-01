"use client"

import { ChatBoxClient, ChatBoxClientProps } from "./chat-box-client"
import { ChatBoxServer } from "./chat-box-server"


export type { ChatBoxClientProps }
export { ChatBoxClient, ChatBoxServer }

/**
 * ChatForm Client Component
 * Uses server action (via ChatFormServer or direct import) to send messages and get responses,
 * pushing the resulting user/assistant messages to setMessages/setMessage state.
 */
export function ChatBox(props: ChatBoxClientProps) {
    return <ChatBoxClient {...props} />
}

export default ChatBox
