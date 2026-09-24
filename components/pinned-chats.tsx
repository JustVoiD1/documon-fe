import { getPinnedChats } from "@/lib/chats/actions"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { IconChevronRight, IconPin } from "@tabler/icons-react"

export default async function PinnedChats() {
    const pinnedChats = await getPinnedChats()
    // const pinnedChats = [
    //     {
    //         id: '1',
    //         title: 'How to do research'
    //     },
    //     {
    //         id: '2',
    //         title: 'How to code'
    //     },
    //     {
    //         id: '3',
    //         title: 'How to football'
    //     },
    // ]
    return <Collapsible
        defaultOpen={false}
        className="group/collapsible"
        render={<SidebarMenuItem />}
    >
        <CollapsibleTrigger
            render={<SidebarMenuButton tooltip={'Pinned Chats'} />}
        >
            <IconPin />
            <span>Pinned Chats</span>
            <IconChevronRight className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
            <SidebarMenuSub>
                {pinnedChats.map((chat) => (
                    <SidebarMenuItem key={`pinned_${chat.title}`}>
                        <SidebarMenuSubButton render={<a href={`chat/${chat.id}`} />}>
                            <span>{chat.title}</span>
                        </SidebarMenuSubButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenuSub>
        </CollapsibleContent>
    </Collapsible>
}