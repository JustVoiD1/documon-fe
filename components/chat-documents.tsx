
import { IconFileCheck, IconFileText, IconX } from "@tabler/icons-react"
import { CardContent } from "./ui/card"
import Link from "next/link"
import { ChatDocumentItem } from "@/components/chat-box-client"
import useChatContext from "@/hooks/use-chat-context"

export function ChatDocuments({ documents }: { documents: ChatDocumentItem[] }) {
    const { removeDocument } = useChatContext()
    const handleRemoveDocument = (id: string) => {
        removeDocument(id)
    }

    return (
        <div className="flex flex-wrap items-center gap-2 pb-1">
            {documents.map((doc, idx) => (
                <Link
                    href={doc.download_url || '#'}
                    target="_blank"
                    key={doc.id}
                    className="bg-secondary/80 border border-border/40 hover:bg-secondary rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-medium text-foreground transition-all group"
                >
                    <div className="bg-background/80 p-1 rounded-md text-muted-foreground group-hover:text-foreground">
                        <IconFileText className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate max-w-50">{doc.name}</span>
                    <button
                        type="button"
                        onClick={() => (doc.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-background/50 ml-0.5"
                        title="Remove document"
                    >
                        <IconX className="h-3.5 w-3.5" />
                    </button>
                </Link>
            ))}
        </div>
    )
}