"use client"

import { ChatDocumentItem, ChatMessageItem } from "@/types";
import { createContext, ReactNode, useState, useEffect } from "react";


export type ChatContextType = {
    chatId: string | null
    setChatId: (id: string | null) => void
    messages: ChatMessageItem[]
    setMessages: React.Dispatch<React.SetStateAction<ChatMessageItem[]>>
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
    const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages);
    const [documents, setDocuments] = useState<ChatDocumentItem[]>(initialDocuments);
    const [input, setInput] = useState<string>("");
    const [isBusy, setIsBusy] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    const addMessage = (message: ChatMessageItem) => {
        setMessages((prev) => [...prev, message]);
    };

    const removeDocument = (id: string) => {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    };

    const clearChat = () => {
        setMessages([]);
        setDocuments([]);
        setInput("");
        setUploadStatus(null);
    };

    return (
        <ChatContext.Provider
            value={{
                chatId,
                setChatId,
                messages,
                setMessages,
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
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
