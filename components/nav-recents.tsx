"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { IconDots, IconTrash, IconPin, IconPencil } from "@tabler/icons-react"

export function NavRecents({
  recents,
}: {
  recents: {
    id: string
    title: string | null
  }[]
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recents</SidebarGroupLabel>
      <SidebarMenu>
        {recents.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton render={<a href={item.id} />}>
              <span>{item.title}</span>
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
                <IconDots
                />
                <span className="sr-only">More</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-fit"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <IconPin
                  />
                  <span>Pin Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPencil
                  />
                  <span>Rename Chat</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <IconTrash
                  />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          {
            recents.length > 0 ?
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <IconDots className="text-sidebar-foreground/70" />
                <span>More</span>
              </SidebarMenuButton> :
              <SidebarMenuButton>
                <span>No recent chats</span>
              </SidebarMenuButton>
          }
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
