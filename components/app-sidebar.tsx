import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavRecents } from "@/components/nav-recents"
import { NavUser } from "@/components/nav-user"
import { Logo } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { IconLayoutRows, IconSettings, IconFrame, IconChartPie, IconMap, IconPin } from "@tabler/icons-react"
import { getUser } from "@/app/auth/user/actions"
import getChats from "@/lib/chats/actions"

// This is sample data.
const logo = {
  name: "Documon",
  icon: <IconLayoutRows />
}
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
  navMain: [
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
  ],
  Recents: [
    {
      name: "Design Engineering",
      url: "#",
      icon: (
        <IconFrame
        />
      ),
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: (
        <IconChartPie
        />
      ),
    },
    {
      name: "Travel",
      url: "#",
      icon: (
        <IconMap
        />
      ),
    },
  ],
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser()
  const currentUser = user ?? data.user
  const recents = await getChats()
  console.log(recents)
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo logo={logo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <React.Suspense
          fallback={<span>Loading...</span>}
        >
          <NavRecents recents={recents} />
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
