"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    IconArrowUp,
    IconGlobe,
    IconPaperclip,
    IconFileText,
    IconX,
    IconLoader2,
    IconFileCheck,
} from "@tabler/icons-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { sendMessageAndGetAIResponse, uploadDocument } from "@/lib/chats/actions"
import ModelSelector from "./model-selector"

export interface ChatMessageItem {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    created_at?: Date | string
}

export interface ChatDocumentItem {
    name: string
    doc_type?: string
    download_url?: string | null
}

export interface ChatBoxClientProps {
    chatId?: string | null
    documents?: ChatDocumentItem[]
    setMessages?: React.Dispatch<React.SetStateAction<ChatMessageItem[]>>
    setMessage?: React.Dispatch<React.SetStateAction<ChatMessageItem[]>> | ((msg: any) => void)
    onMessageSent?: (userMessage: ChatMessageItem, assistantMessage: ChatMessageItem, newChatId?: string) => void
    serverAction?: (params: { chatId?: string | null; query: string }) => Promise<{
        chatId: string
        userMessage: ChatMessageItem
        assistantMessage: ChatMessageItem
        chatTitle?: string
    }>
    uploadAction?: (formData: FormData) => Promise<{ success: boolean; message?: string; error?: string }>
    disabled?: boolean
    placeholder?: string
    className?: string
}

export function ChatBoxClient({
    chatId = null,
    documents = [],
    setMessages,
    setMessage,
    onMessageSent,
    serverAction = sendMessageAndGetAIResponse,
    uploadAction = uploadDocument,
    disabled = false,
    placeholder = "Type your message or ask about your documents...",
    className = "",
}: ChatBoxClientProps) {
    const router = useRouter()
    const [input, setInput] = useState("")
    const [isBusy, setIsBusy] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<string | null>(null)
    const [docList, setDocList] = useState<ChatDocumentItem[]>(documents)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        setDocList(documents)
    }, [chatId])

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            const nextHeight = Math.min(textareaRef.current.scrollHeight, 200)
            textareaRef.current.style.height = `${nextHeight}px`
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
        adjustTextareaHeight()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const updateMessagesState = (updater: (prev: ChatMessageItem[]) => ChatMessageItem[]) => {
        if (setMessages) {
            setMessages(updater)
        } else if (setMessage) {
            if (typeof setMessage === "function") {
                setMessage(updater as any)
            }
        }
    }

    const handleRemoveDocument = (indexToRemove: number) => {
        setDocList((prev) => prev.filter((_, idx) => idx !== indexToRemove))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const queryText = input.trim()
        if (!queryText || isBusy || disabled) return

        setInput("")
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }

        // Optimistically add user message
        const tempUserMsg: ChatMessageItem = {
            id: `temp-user-${Date.now()}`,
            role: "user",
            content: queryText,
        }

        updateMessagesState((prev) => [...prev, tempUserMsg])
        setIsBusy(true)

        try {
            const res = await serverAction({
                chatId: chatId,
                query: queryText,
            })

            const userMsg = res.userMessage as ChatMessageItem
            const assistantMsg = res.assistantMessage as ChatMessageItem

            // Replace temp user message and add assistant response
            updateMessagesState((prev) => [
                ...prev.filter((m) => m.id !== tempUserMsg.id),
                userMsg,
                assistantMsg,
            ])

            if (onMessageSent) {
                onMessageSent(userMsg, assistantMsg, res.chatId)
            }

            // If a new chat session was created, navigate to /chat/[chatId]
            if (!chatId && res.chatId) {
                router.push(`/chat/${res.chatId}`)
                router.refresh()
            }
        } catch (err) {
            console.error("Failed to send message:", err)
            const errorAssistantMsg: ChatMessageItem = {
                id: `error-${Date.now()}`,
                role: "assistant",
                content: "Sorry, an error occurred while generating a response. Please try again.",
            }
            updateMessagesState((prev) => [...prev, errorAssistantMsg])
        } finally {
            setIsBusy(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const file = files[0]
        setIsBusy(true)
        setUploadStatus(`Uploading "${file.name}"...`)

        const formData = new FormData()
        formData.append("file", file)
        if (chatId) {
            formData.append("chat_id", chatId)
        }

        try {
            const response = await uploadAction(formData)
            if (response.success) {
                setUploadStatus(`Uploaded "${file.name}" successfully!`)
                setDocList((prev) => [...prev, { name: file.name, doc_type: file.type }])

                const systemMsg: ChatMessageItem = {
                    id: `upload-sys-${Date.now()}`,
                    role: "assistant",
                    content: `📎 **Uploaded document:** ${file.name}\n\n${response.message || "File uploaded and processed."}`,
                }
                updateMessagesState((prev) => [...prev, systemMsg])
            } else {
                setUploadStatus(`Upload error: ${response.error}`)
            }
        } catch (err: any) {
            console.error("Upload error:", err)
            setUploadStatus(`Failed to upload "${file.name}".`)
        } finally {
            setIsBusy(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
            setTimeout(() => setUploadStatus(null), 5000)
        }
    }

    return (
        <div className={`w-full flex flex-col ${className}`}>
            {uploadStatus && (
                <div className="mb-2 px-4 py-1.5 bg-accent/60 text-xs text-accent-foreground flex items-center gap-2 rounded-xl border border-border/40">
                    <IconFileCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{uploadStatus}</span>
                </div>
            )}

            <div className="w-full bg-card border border-border/60 rounded-2xl p-3 shadow-lg flex flex-col gap-2.5 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
                {/* Uploaded Document Chips */}
                {docList.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pb-1">
                        {docList.map((doc, idx) => (
                            <div
                                key={idx}
                                className="bg-secondary/80 border border-border/40 hover:bg-secondary rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-foreground transition-all group"
                            >
                                <div className="bg-background/80 p-1 rounded-md text-muted-foreground group-hover:text-foreground">
                                    <IconFileText className="h-3.5 w-3.5" />
                                </div>
                                <span className="truncate max-w-[200px]">{doc.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveDocument(idx)}
                                    className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-background/50 ml-0.5"
                                    title="Remove document"
                                >
                                    <IconX className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Auto-expanding Textarea Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2.5">
                    {chatId && <input type="hidden" value={chatId} name="chatId" />}

                    <textarea
                        ref={textareaRef}
                        rows={1}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isBusy || disabled}
                        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/70 resize-none border-none outline-none text-sm px-1 py-1 min-h-[38px] max-h-[200px] overflow-y-auto focus:outline-none focus:ring-0 leading-relaxed"
                    />

                    {/* Bottom Action Controls */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/20">
                        <div className="flex items-center gap-2">
                            {/* File Attachment Pill Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isBusy || disabled}
                                className="h-9 w-9 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center text-foreground transition-all border border-border/30 disabled:opacity-50"
                                title="Attach document"
                            >
                                <IconPaperclip className="h-4 w-4" />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".pdf,.txt,.docx,.csv,.md,.png,.jpg,.jpeg"
                                />
                            </button>

                            {/* Model Selector Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuContent align="start" side="top" className="w-48">
                                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                                        <IconPaperclip className="h-4 w-4 mr-2" />
                                        <span>Upload Document</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <IconGlobe className="h-4 w-4 mr-2" />
                                        <span>Web Search</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Circular Blue Send Button */}
                        <button
                            type="submit"
                            disabled={!input.trim() || isBusy || disabled}
                            className="h-9 w-9 rounded-full bg-primary hover:bg-primary/80 active:scale-95 text-white flex items-center justify-center shadow-md transition-all disabled:opacity-40 disabled:bg-muted disabled:text-muted-foreground disabled:active:scale-100 shrink-0 ml-auto"
                            title="Send message"
                        >
                            {isBusy ? (
                                <IconLoader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <IconArrowUp className="h-4 w-4 stroke-[2.5]" />
                            )}
                            <span className="sr-only">Send</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
