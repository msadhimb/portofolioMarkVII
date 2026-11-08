"use client"

import Link from "next/link"

import { Globe } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import OverviewContent from "./components/OverviewContent"

type DashboardViewProps = { title?: string; children?: React.ReactNode }

const DashboardView = ({
  title = "Ringkasan",
  children,
}: DashboardViewProps) => {
  const isOverview = !children

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/70 shadow-[inset_0_-1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 dark:shadow-[inset_0_-1px_0_rgba(255,255,255,0.06)]">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/" target="_blank">
                  <Globe />
                  <span className="hidden sm:inline">Lihat situs</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col p-4 md:p-6">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5">
            {isOverview ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.2em] text-signal uppercase">
                      Admin console
                    </p>
                    <h2 className="mt-1.5 text-2xl font-medium tracking-[-0.02em]">
                      {title}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-signal" />
                    Sistem normal
                  </span>
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
