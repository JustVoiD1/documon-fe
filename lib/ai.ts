import type { ChatTransport, UIMessageChunk } from "ai"

export interface ChatMessage {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    parts: Array<{ type: "text"; text: string }>
}

interface ChatStep {
    userMessage: ChatMessage
    assistantMessage: ChatMessage
    sleepMs: number
}

export class ChatBuilder {
    private steps: ChatStep[] = []
    private pendingUserText: string | null = null
    private pendingSleepMs: number = 0
    private messageIdCounter: number = 1

    user(content: string): this {
        if (this.pendingUserText !== null) {
            this.flushPendingUser()
        }
        this.pendingUserText = content
        return this
    }

    sleep(ms: number): this {
        this.pendingSleepMs = ms
        return this
    }

    assistant(content: string): this {
        const userText = this.pendingUserText ?? ""
        this.pendingUserText = null

        const userId = `user-${this.messageIdCounter}`
        const assistantId = `assistant-${this.messageIdCounter}`
        this.messageIdCounter++

        const userMsg: ChatMessage = {
            id: userId,
            role: "user",
            content: userText,
            parts: [{ type: "text", text: userText }],
        }

        const assistantMsg: ChatMessage = {
            id: assistantId,
            role: "assistant",
            content: content,
            parts: [{ type: "text", text: content }],
        }

        this.steps.push({
            userMessage: userMsg,
            assistantMessage: assistantMsg,
            sleepMs: this.pendingSleepMs,
        })

        this.pendingSleepMs = 0
        return this
    }

    private flushPendingUser(): void {
        if (this.pendingUserText === null) return
        const userId = `user-${this.messageIdCounter++}`
        const userMsg: ChatMessage = {
            id: userId,
            role: "user",
            content: this.pendingUserText,
            parts: [{ type: "text", text: this.pendingUserText }],
        }

        this.steps.push({
            userMessage: userMsg,
            assistantMessage: {
                id: `assistant-dummy-${Date.now()}`,
                role: "assistant",
                content: "",
                parts: [{ type: "text", text: "" }],
            },
            sleepMs: this.pendingSleepMs,
        })
        this.pendingUserText = null
        this.pendingSleepMs = 0
    }

    get(count?: number): ChatMessage[] {
        this.flushPendingUser()
        const allMessages: ChatMessage[] = []
        for (const step of this.steps) {
            if (step.userMessage.content) allMessages.push(step.userMessage)
            if (step.assistantMessage.content) allMessages.push(step.assistantMessage)
        }

        if (count === undefined) {
            return allMessages
        }
        return allMessages.slice(0, count)
    }

    next(currentMessages: any[] = []): ChatMessage | undefined {
        this.flushPendingUser()
        const sentUserCount = (currentMessages || []).filter(
            (m: any) => m.role === "user"
        ).length

        if (sentUserCount < this.steps.length) {
            return this.steps[sentUserCount].userMessage
        }

        return undefined
    }

    transport(transportOptions: { delayMs?: number } = {}): ChatTransport<any> {
        this.flushPendingUser()
        const steps = this.steps
        const tokenDelay = transportOptions.delayMs ?? 20

        return {
            async sendMessages({ messages }) {
                const userMessages = messages.filter((m: any) => m.role === "user")
                const turnIndex = Math.max(0, userMessages.length - 1)
                const targetStep = steps[turnIndex]

                const assistantMsg = targetStep
                    ? targetStep.assistantMessage
                    : {
                          id: `assistant-gen-${Date.now()}`,
                          role: "assistant" as const,
                          content: "Simulated response.",
                          parts: [{ type: "text" as const, text: "Simulated response." }],
                      }

                const sleepDuration = targetStep ? targetStep.sleepMs : 500
                const textToStream = assistantMsg.content
                const partId = `part-${assistantMsg.id}`

                return new ReadableStream<UIMessageChunk>({
                    async start(controller) {
                        if (sleepDuration > 0) {
                            await new Promise((res) => setTimeout(res, sleepDuration))
                        }

                        controller.enqueue({ type: "text-start", id: partId })

                        const words = textToStream.match(/\S+|\s+/g) || [textToStream]
                        for (const word of words) {
                            if (tokenDelay > 0) {
                                await new Promise((res) => setTimeout(res, tokenDelay))
                            }
                            controller.enqueue({
                                type: "text-delta",
                                id: partId,
                                delta: word,
                            })
                        }

                        controller.enqueue({ type: "text-end", id: partId })
                        controller.close()
                    },
                })
            },
            async reconnectToStream() {
                return null
            },
        }
    }
}

export function createChat(): ChatBuilder {
    return new ChatBuilder()
}

export function getMessageText(message: any): string {
    if (!message) return ""
    if (typeof message === "string") return message
    if (typeof message.content === "string" && message.content.length > 0) {
        return message.content
    }
    if (Array.isArray(message.parts)) {
        return message.parts
            .filter((p: any) => p && (p.type === "text" || typeof p.text === "string"))
            .map((p: any) => p.text || "")
            .join("")
    }
    return ""
}
