"use client"

import { ChatBoxClient } from "./chat-box-client"

/**
 * ChatForm Client Component
 * Uses server action (via ChatFormServer or direct import) to send messages and get responses,
 * pushing the resulting user/assistant messages to setMessages/setMessage state.
 */
export function ChatBox() {
    return <ChatBoxClient />
}

export default ChatBox
