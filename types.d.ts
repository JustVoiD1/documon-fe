export interface ChatMessageItem {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    created_at?: Date | string
}

export interface ChatDocumentItem {
    id: string,
    name: string,
    doc_type: string,
    download_url: string | null
}
