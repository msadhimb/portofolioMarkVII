"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  AwardIcon,
  BriefcaseBusinessIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Administrator",
    email: "admin@salmanbaqy.dev",
  },
  navMain: [
    {
      title: "Ringkasan",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Pengunjung",
      url: "/dashboard/visitors",
      icon: <UsersIcon />,
    },
    {
      title: "Proyek",
      url: "/dashboard/projects",
      icon: <FolderKanbanIcon />,
    },
    {
      title: "Pengalaman",
      url: "/dashboard/experiences",
      icon: <BriefcaseBusinessIcon />,
    },
    {
      title: "Penghargaan",
      url: "/dashboard/awards",
      icon: <AwardIcon />,
    },
    {
      title: "Keahlian",
      url: "/dashboard/skills",
      icon: <SparklesIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
