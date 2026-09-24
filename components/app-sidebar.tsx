import { Suspense } from "react"
import Link from "next/link"
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
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { IconLayoutRows, IconPlus } from "@tabler/icons-react"
import { getUser } from "@/app/auth/user/actions"
import { getChats } from "@/lib/chats/actions"
import { redirect } from "next/navigation"

const logo = {
  name: "DocuMon",
  icon: <IconLayoutRows />
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = await getUser()
  if (!user) redirect("/auth/sign-in")
  const recents = await getChats()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo logo={logo} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/chat" />}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                <IconPlus className="h-4 w-4" />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain />
        <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading recents...</div>}>
          <NavRecents recents={recents} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
