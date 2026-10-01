import { createContext, ReactNode, useState } from "react";

export interface ChatMessageItem {
    id: string
    role: "user" | "assistant" | "system"
    content: string
}

export interface ChatDocument {
    name: string,
    doc_type: string,
    download_url: string | null
}

export type ChatContextType = {
    chatId: string | null
    setChatId: (id: string) => void
    messages: ChatMessageItem[]
    setMessages: (messages: ChatMessageItem[]) => void
    docList: ChatDocument[]
    setDocList: (docs: ChatDocument[]) => void
}


export const ChatContext = createContext<ChatContextType | null>(null)

export const ChatProvider = ({ children }: { children: ReactNode }) => {

    const [messages, setMessages] = useState<ChatMessageItem[]>([])
    const [chatId, setChatId] = useState<string | null>(null)

    const [docList, setDocList] = useState<ChatDocument[]>([]);



    return <ChatContext.Provider value={{ chatId, setChatId, messages, setMessages, docList, setDocList }}>
        {children}
    </ChatContext.Provider>
}
