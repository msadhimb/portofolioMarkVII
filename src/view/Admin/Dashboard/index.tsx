"use client"

import Link from "next/link"

import { Globe } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import OverviewContent from "./components/OverviewContent"
import { formatDateID } from "./helper/formatDateID"

type DashboardViewProps = { title?: string; children?: React.ReactNode }

const DashboardView = ({
  title = "Overview",
  children,
}: DashboardViewProps) => {
  const isOverview = !children
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)] opacity-60" />
        <div className="pointer-events-none absolute -top-32 right-0 -z-0 size-96 rounded-full bg-signal/10 blur-3xl" />

        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/70 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden font-mono text-[11px] text-muted-foreground lg:block">
                {formatDateID()}
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/" target="_blank">
                  <Globe />
                  <span className="hidden sm:inline">Lihat situs</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="relative flex flex-1 flex-col gap-4 p-4 md:p-6">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4">
            {isOverview ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="font-mono text-[11px] tracking-widest text-signal uppercase">
                      {"// control-center"}
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                      {title}
                    </h2>
                  </div>
                  <Badge variant="secondary" className="gap-1.5">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Semua sistem normal
                  </Badge>
                </div>
                <OverviewContent />
              </>
            ) : (
              children
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardView
