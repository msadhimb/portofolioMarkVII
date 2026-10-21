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
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"

// This is sample data.
const data = {
  user: {
    name: "Admin",
    email: "admin@salmanbaqy.dev",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Portfolio Admin",
      logo: <GalleryVerticalEndIcon />,
      plan: "Admin",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/admin/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Visitors",
      url: "/admin/dashboard/visitors",
      icon: <UsersIcon />,
    },
    {
      title: "Projects",
      url: "/admin/dashboard/projects",
      icon: <FolderKanbanIcon />,
    },
    {
      title: "Experiences",
      url: "/admin/dashboard/experiences",
      icon: <BriefcaseBusinessIcon />,
    },
    {
      title: "Awards",
      url: "/admin/dashboard/awards",
      icon: <AwardIcon />,
    },
    {
      title: "Skills",
      url: "/admin/dashboard/skills",
      icon: <SparklesIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
