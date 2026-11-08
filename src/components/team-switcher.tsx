"use client"

import Link from "next/link"
import { LayoutDashboardIcon } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-foreground font-mono text-[10px] font-medium text-background">
              SA
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Portfolio</span>
              <span className="truncate font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                Admin console
              </span>
            </div>
            <LayoutDashboardIcon className="ml-auto size-4 text-muted-foreground" />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
