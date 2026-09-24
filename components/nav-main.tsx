


import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { getPinnedChats } from "@/lib/chats/actions"
import { IconChevronRight, IconPin, IconSettings } from "@tabler/icons-react"
import PinnedChats from "./pinned-chats"

const navMain = [
  {
    title: "Pinned Chats",
    url: "#",
    icon: (
      <IconPin
      />
    ),
    items: [
      {
        title: "Introduction",
        url: "#",
      },
      {
        title: "Get Started",
        url: "#",
      },
      {
        title: "Tutorials",
        url: "#",
      },
      {
        title: "Changelog",
        url: "#",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: (
      <IconSettings
      />
    ),
    items: [
      {
        title: "General",
        url: "#",
      },
      {
        title: "Team",
        url: "#",
      },
      {
        title: "Billing",
        url: "#",
      },
      {
        title: "Limits",
        url: "#",
      },
    ],
  },
]

export async function NavMain() {
  const pinnedChats = await getPinnedChats()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <PinnedChats />
      </SidebarMenu>
    </SidebarGroup>
  )
}
