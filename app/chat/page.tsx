import { AppSidebar } from "@/components/app-sidebar"
import { ChatWindow } from "@/components/chat-window"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ChatProvider } from "../context/chat-context"
import { ChatHeader } from "@/components/chat-header"

export default async function Page() {
    return (
        <ChatProvider
            initialChatId={null}
            initialMessages={[]}
            initialDocuments={[]}
        >

            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="h-svh overflow-hidden">
                    <ChatHeader title={'New Chat'} />
                    <div className="flex flex-1 flex-col min-h-0 gap-4 p-4 pt-0 overflow-hidden">
                        <div className="h-full flex-1 min-h-0 rounded-xl bg-muted/50 overflow-hidden">
                            <ChatWindow />
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ChatProvider>
    )
}
