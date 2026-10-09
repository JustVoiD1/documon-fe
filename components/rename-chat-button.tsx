"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { renameChat } from "@/lib/chats/actions"

interface RenameChatDialogProps {
    chatId: string
    currentTitle: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function RenameChatDialog({
    chatId,
    currentTitle,
    open,
    onOpenChange,
}: RenameChatDialogProps) {
    const [title, setTitle] = useState(currentTitle || "")
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (open) {
            setTitle(currentTitle || "")
            setError(null)
        }
    }, [open, currentTitle])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedTitle = title.trim()
        if (!trimmedTitle) {
            setError("Title cannot be empty")
            return
        }
        if (trimmedTitle === currentTitle) {
            onOpenChange(false)
            return
        }

        setIsPending(true)
        setError(null)
        try {
            const res = await renameChat(chatId, trimmedTitle)
            if (res.success) {
                onOpenChange(false)
                router.refresh()
            } else {
                setError(res.error || "Failed to rename chat")
            }
        } catch {
            setError("An unexpected error occurred")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Rename Chat</DialogTitle>
                        <DialogDescription>
                            Enter a new title for this chat conversation.
                        </DialogDescription>
                    </DialogHeader>
                    <Field>
                        <Label htmlFor="rename-chat-title">Title</Label>
                        <Input
                            id="rename-chat-title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter chat title..."
                            disabled={isPending}
                            autoFocus
                        />
                        {error && (
                            <p className="text-xs text-destructive mt-1">{error}</p>
                        )}
                    </Field>
                    <DialogFooter>
                        <DialogClose render={<Button type="button" variant="outline" disabled={isPending}>Cancel</Button>} />
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

