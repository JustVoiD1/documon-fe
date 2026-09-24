
import { IconFileCheck } from "@tabler/icons-react"
import { CardContent } from "./ui/card"
import Link from "next/link"

export function ChatDocuments({ documents }: { documents: { name: string, doc_type: string, download_url: string | null }[] }) {
    return (
        <div className="text-xs text-accent-foreground flex items-center gap-2 border-border/40">
            <CardContent className="flex-1 min-h-20 flex justify-center items-center px-4 py-1.5 text-xs gap-3 overflow-hidden p-0 rounded-md max-w-30 bg-accent/60">
                {documents.map((document, idx) => (<Link href={document.download_url || '#'} target={'_blank'} key={idx}>
                    <IconFileCheck className="h-3.5 w-3.5 shrink-0" />
                    <span>{document.name}</span>
                </Link>
                ))}
            </CardContent>
        </div>
    )
}