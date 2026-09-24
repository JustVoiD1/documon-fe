"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { IconDots, IconTrash, IconMessage } from "@tabler/icons-react"
import { deleteChat } from "@/lib/chats/actions"

export function NavRecents({
  recents,
}: {
  recents: {
    id: string
    title: string | null
  }[]
}) {
  const { isMobile } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()

  const handleDelete = async (chatId: string) => {
    const res = await deleteChat(chatId)
    if (res.success) {
      if (pathname === `/chat/${chatId}`) {
        router.push("/chat")
      } else {
        router.refresh()
      }
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between">
        <span>Recents</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {recents.map((item) => {
          const isActive = pathname === `/chat/${item.id}`

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={item.title || "Untitled Chat"}
                render={
                  <Link
                    href={`/chat/${item.id}`}
                    className={`flex items-center gap-2 w-full truncate ${isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : ""
                      }`}
                  />
                }
              >
                <IconMessage className="h-4 w-4 shrink-0 opacity-70" />
                <span className="truncate">{item.title || "Untitled Chat"}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuAction
                      showOnHover
                      className="aria-expanded:bg-muted"
                    />
                  }
                >
                  <IconDots />
                  <span className="sr-only">More</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-fit"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem variant="destructive" onClick={() => handleDelete(item.id)}>
                    <IconTrash />
                    <span>Delete Chat</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
        {recents.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="text-muted-foreground text-xs italic">
              <span>No recent chats</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
