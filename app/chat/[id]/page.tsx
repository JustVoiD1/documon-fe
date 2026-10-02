import { getChatById, getDocumentsByChatId } from "@/lib/chats/actions";
import { AppSidebar } from "@/components/app-sidebar";
import { ChatWindow } from "@/components/chat-window";
import { ChatHeader } from "@/components/chat-header";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { ChatProvider } from "@/app/context/chat-context";

export default async function ChatPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const chat = await getChatById(id);
    const documents = await getDocumentsByChatId(id)

    if (!chat) {
        redirect("/chat");
    }

    const initialMessages = chat.messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
    }));

    return (
        <ChatProvider
            initialChatId={chat.id}
            initialMessages={initialMessages}
            initialDocuments={documents}
        >
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="h-svh overflow-hidden">
                    <ChatHeader title={chat.title || 'New Chat'} />
                    <div className="flex flex-1 flex-col min-h-0 gap-4 p-4 pt-0 overflow-hidden">
                        <div className="h-full flex-1 min-h-0 rounded-xl bg-muted/50 overflow-hidden">
                            <ChatWindow />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ChatProvider>
    );
}
