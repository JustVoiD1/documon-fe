"use client"

import { ChatDocumentItem, ChatMessageItem } from "@/types";
import { createContext, ReactNode, useState } from "react";
import { useChat } from "@ai-sdk/react";


export type ChatContextType = {
    chatId: string | null
    setChatId: (id: string | null) => void
    messages: ChatMessageItem[]
    setMessages: (messages: ChatMessageItem[] | ((prev: ChatMessageItem[]) => ChatMessageItem[])) => void
    documents: ChatDocumentItem[]
    setDocuments: React.Dispatch<React.SetStateAction<ChatDocumentItem[]>>
    input: string
    setInput: React.Dispatch<React.SetStateAction<string>>
    isBusy: boolean
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>
    uploadStatus: string | null
    setUploadStatus: React.Dispatch<React.SetStateAction<string | null>>
    addMessage: (message: ChatMessageItem) => void
    removeDocument: (id: string) => void
    clearChat: () => void
    status?: string
}

export const ChatContext = createContext<ChatContextType | null>(null);

export interface ChatProviderProps {
    children: ReactNode
    initialChatId?: string | null
    initialMessages?: ChatMessageItem[]
    initialDocuments?: ChatDocumentItem[]
}

export const ChatProvider = ({
    children,
    initialChatId = null,
    initialMessages = [],
    initialDocuments = [],
}: ChatProviderProps) => {
    const [chatId, setChatId] = useState<string | null>(initialChatId);
    const [documents, setDocuments] = useState<ChatDocumentItem[]>(initialDocuments);
    const [input, setInput] = useState<string>("");
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    const {
        messages: chatMessages,
        setMessages: setChatMessages,
        status,
    } = useChat({
        id: chatId || undefined,
        messages: initialMessages as any,
    });

    const addMessage = (message: ChatMessageItem) => {
        setChatMessages((prev: any) => [...prev, message]);
    };

    const removeDocument = (id: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    };

    const clearChat = () => {
        setChatMessages([]);
        setDocuments([]);
        setInput("");
        setUploadStatus(null);
    };

    return (
        <ChatContext.Provider
            value={{
                chatId,
                setChatId,
                messages: chatMessages as unknown as ChatMessageItem[],
                setMessages: setChatMessages as any,
                documents,
                setDocuments,
                input,
                setInput,
                isBusy,
                setIsBusy,
                uploadStatus,
                setUploadStatus,
                addMessage,
                removeDocument,
                clearChat,
                status,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

