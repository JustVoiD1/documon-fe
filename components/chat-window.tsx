"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    IconArrowUp,
    IconGlobe,
    IconCamera,
    IconMessageCircle,
    IconPaperclip,
    IconPlus,
    IconTelescope,
    IconLoader2,
    IconFileCheck,
} from "@tabler/icons-react"

import { MessageAnimated } from "@/components/message-animated"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group"
import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerProvider,
    MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { sendMessageAndGetAIResponse, uploadDocument } from "@/lib/chats/actions"
import { ChatDocuments } from "./chat-documents"

export interface ChatMessageItem {
    id: string
    role: "user" | "assistant" | "system"
    content: string
}

interface ChatWindowProps {
    chatId?: string | null
    initialMessages?: ChatMessageItem[],
    documents?: { name: string, doc_type: string, download_url: string | null }[]
}

export function ChatWindow({ chatId = null, initialMessages = [], documents = [] }: ChatWindowProps) {
    const router = useRouter()
    const [messages, setMessages] = useState<ChatMessageItem[]>(initialMessages)
    const [input, setInput] = useState("")
    const [isBusy, setIsBusy] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setMessages(initialMessages)
    }, [chatId, initialMessages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const queryText = input.trim()
        if (!queryText || isBusy) return

        setInput("")

        // Optimistically add user message
        const tempUserMsg: ChatMessageItem = {
            id: `temp-user-${Date.now()}`,
            role: "user",
            content: queryText,
        }
        setMessages((prev) => [...prev, tempUserMsg])
        setIsBusy(true)

        try {
            const res = await sendMessageAndGetAIResponse({
                chatId: chatId,
                query: queryText,
            })

            // Replace temp user message and add assistant response
            setMessages((prev) => [
                ...prev.filter((m) => m.id !== tempUserMsg.id),
                res.userMessage as ChatMessageItem,
                res.assistantMessage as ChatMessageItem,
            ])

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
            setMessages((prev) => [...prev, errorAssistantMsg])
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
            const response = await uploadDocument(formData)
            if (response.success) {
                setUploadStatus(`Uploaded "${file.name}" successfully!`)

                const systemMsg: ChatMessageItem = {
                    id: `upload-sys-${Date.now()}`,
                    role: "assistant",
                    content: `📎 **Uploaded document:** ${file.name}\n\n${response.message || "File uploaded and processed."}`,
                }
                setMessages((prev) => [...prev, systemMsg])
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
        <MessageScrollerProvider>
            <div className="relative flex h-full min-h-0 w-full flex-col gap-4">
                {/* <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".pdf,.txt,.docx,.csv,.md,.png,.jpg,.jpeg"
                        /> */}

                <Card className="mx-auto flex h-full min-h-0 w-full flex-col gap-0 overflow-hidden border-none shadow-none bg-transparent">
                    <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
                        {messages.length === 0 ? (
                            <Empty className="h-full flex flex-col items-center justify-center">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <IconMessageCircle className="h-10 w-10 text-primary" />
                                    </EmptyMedia>
                                    <EmptyTitle>Start a Conversation</EmptyTitle>
                                    <EmptyDescription>
                                        Ask questions or upload documents for intelligent analysis.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        ) : (
                            <MessageScroller>
                                <MessageScrollerViewport>
                                    <MessageScrollerContent
                                        aria-busy={isBusy}
                                        className="p-4 space-y-4"
                                    >
                                        {messages.map((message) => (
                                            <MessageAnimated
                                                key={message.id}
                                                message={message}
                                                scrollAnchor={message.role === "user"}
                                            />
                                        ))}

                                        {isBusy && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground italic px-2 py-1">
                                                <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                                                <span>AI is thinking...</span>
                                            </div>
                                        )}
                                    </MessageScrollerContent>
                                </MessageScrollerViewport>
                                <MessageScrollerButton />
                            </MessageScroller>
                        )}
                    </CardContent>

                    {uploadStatus && (
                        <div className="px-4 py-1.5 bg-accent/60 text-xs text-accent-foreground flex items-center gap-2 border-t border-border/40">
                            <IconFileCheck className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{uploadStatus}</span>
                        </div>
                    )}
                    {/* show the list fo documents */}
                    {documents.length > 0 && (
                        <ChatDocuments documents={documents} />
                    )}

                    <CardFooter className="flex-col gap-2 shrink-0 p-0 bg-background border-t border-border/30">
                        <form onSubmit={handleSubmit} className="w-full">
                            <InputGroup>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message or ask about your documents..."
                                    disabled={isBusy}
                                    className="focus:outline-none text-foreground min-h-12 w-full px-3 py-2 text-sm bg-transparent"
                                />
                                <InputGroupAddon align="block-end" className="pt-1">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <InputGroupButton
                                                    aria-label="Add files"
                                                    type="button"
                                                    size="icon-sm"
                                                    variant="outline"
                                                    disabled={false}
                                                >
                                                    <IconPlus className="h-4 w-4" />
                                                </InputGroupButton>
                                            }
                                        />
                                        <DropdownMenuContent
                                            align="start"
                                            side="top"
                                            className="w-48"
                                        >
                                            <DropdownMenuItem
                                                onClick={() => fileInputRef.current?.click()}
                                                className="cursor-pointer"
                                            >
                                                <IconPaperclip className="h-4 w-4 mr-2" />
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    accept=".pdf,.txt,.docx,.csv,.md,.png,.jpg,.jpeg"
                                                />Upload Document
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem disabled={false}>
                                                <IconGlobe className="h-4 w-4 mr-2" />
                                                <span>Web Search</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <InputGroupButton
                                        type="submit"
                                        variant="default"
                                        size="icon-sm"
                                        disabled={!input.trim() || isBusy}
                                        className="ml-auto"
                                    >
                                        {isBusy ? (
                                            <IconLoader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <IconArrowUp className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">Send</span>
                                    </InputGroupButton>
                                </InputGroupAddon>
                            </InputGroup>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </MessageScrollerProvider>

    )
}
