import { AppSidebar } from "@/components/app-sidebar"
import { ChatWindow } from "@/components/chat-window"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function Page() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-svh overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <span className="font-medium text-sm">New Chat</span>
                    </div>
                </header>
                <div className="flex flex-1 flex-col min-h-0 gap-4 p-4 pt-0 overflow-hidden">
                    <div className="h-full flex-1 min-h-0 rounded-xl bg-muted/50 overflow-hidden">
                        <ChatWindow chatId={null} initialMessages={[]} />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
