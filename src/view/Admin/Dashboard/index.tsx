"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  AwardIcon,
  BadgeCheck,
  BriefcaseBusinessIcon,
  CalendarDays,
  CircleDot,
  Database,
  FolderKanbanIcon,
  Globe,
  Languages,
  LayoutDashboardIcon,
  Plus,
  SparklesIcon,
  Star,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useProjects } from "@/components/Projects/store"
import { useExperiences } from "@/components/Experience/store"
import { useAwards } from "@/components/Awards/store"
import { useSkills } from "@/components/Skills/store"
import { unwrapList } from "@/lib/pagination"

type DashboardViewProps = {
  title?: string
  children?: React.ReactNode
}

type AdminProjectLike = {
  slug: string
  featured?: boolean
  image?: string | null
  demo_url?: string | null
  sort_order?: number
  technologies?: string[]
  translations?: Record<string, { title?: string }>
}

type AdminSkillGroupLike = {
  items?: string[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: "easeOut" as const },
  }),
}

function greeting() {
  const h = new Date().getHours()
  if (h < 11) return "Selamat pagi"
  if (h < 15) return "Selamat siang"
  if (h < 19) return "Selamat sore"
  return "Selamat malam"
}

function formatDateID() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date())
}

const DONUT_COLORS = ["#22d3ee", "#a78bfa", "#34d399", "#fbbf24"]

function OverviewContent() {
  const { getAdminProjects } = useProjects()
  const { getAdminExperiences } = useExperiences()
  const { getAdminAwards } = useAwards()
  const { getAdminSkillGroups } = useSkills()

  const projectsQuery = useQuery({
    queryKey: ["admin", "projects", "overview"],
    queryFn: () => getAdminProjects(),
  })
  const experiencesQuery = useQuery({
    queryKey: ["admin", "experiences", "overview"],
    queryFn: () => getAdminExperiences(),
  })
  const awardsQuery = useQuery({
    queryKey: ["admin", "awards", "overview"],
    queryFn: () => getAdminAwards(),
  })
  const skillsQuery = useQuery({
    queryKey: ["admin", "skills", "overview"],
    queryFn: () => getAdminSkillGroups(),
  })

  const loading =
    projectsQuery.isLoading ||
    experiencesQuery.isLoading ||
    awardsQuery.isLoading ||
    skillsQuery.isLoading

  const projects = useMemo(
    () => unwrapList<AdminProjectLike>(projectsQuery.data),
    [projectsQuery.data]
  )
  const experiences = useMemo(
    () => unwrapList<unknown>(experiencesQuery.data),
    [experiencesQuery.data]
  )
  const awards = useMemo(
    () => unwrapList<unknown>(awardsQuery.data),
    [awardsQuery.data]
  )
  const skillGroups = useMemo(
    () => unwrapList<AdminSkillGroupLike>(skillsQuery.data),
    [skillsQuery.data]
  )

  const stats = useMemo(() => {
    const featured = projects.filter((p) => p?.featured).length
    const totalSkills = skillGroups.reduce(
      (acc: number, g) => acc + (g?.items?.length ?? 0),
      0
    )
    const withImage = projects.filter((p) => Boolean(p?.image)).length
    const withDemo = projects.filter((p) => Boolean(p?.demo_url)).length
    const bilingual = projects.filter(
      (p) => p?.translations?.id?.title && p?.translations?.en?.title
    ).length
    return { featured, totalSkills, withImage, withDemo, bilingual }
  }, [projects, skillGroups])

  const donutData = useMemo(
    () => [
      { name: "Projects", value: projects.length },
      { name: "Experiences", value: experiences.length },
      { name: "Awards", value: awards.length },
      { name: "Skill groups", value: skillGroups.length },
      { name: "Skill items", value: stats.totalSkills },
    ],
    [
      projects.length,
      experiences.length,
      awards.length,
      skillGroups.length,
      stats.totalSkills,
    ]
  )

  const spark = (seed: number[]) => seed.map((v, i) => ({ i, v }))

  const statCards = [
    {
      label: "Projects",
      value: projects.length,
      hint: `${stats.featured} unggulan · ${stats.bilingual} bilingual`,
      href: "/admin/dashboard/projects",
      icon: <FolderKanbanIcon className="size-4" />,
      tile: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
      sparkData: spark([3, 5, 4, 7, 6, 9, 8]),
      sparkColor: "#22d3ee",
    },
    {
      label: "Experiences",
      value: experiences.length,
      hint: "Riwayat kerja & peran",
      href: "/admin/dashboard/experiences",
      icon: <BriefcaseBusinessIcon className="size-4" />,
      tile: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
      sparkData: spark([2, 3, 5, 4, 6, 5, 7]),
      sparkColor: "#a78bfa",
    },
    {
      label: "Awards",
      value: awards.length,
      hint: "Sertifikat, penghargaan & honor",
      href: "/admin/dashboard/awards",
      icon: <AwardIcon className="size-4" />,
      tile: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
      sparkData: spark([1, 3, 2, 4, 3, 5, 4]),
      sparkColor: "#fb7185",
    },
    {
      label: "Skill groups",
      value: skillGroups.length,
      hint: `${stats.totalSkills} skill items`,
      href: "/admin/dashboard/skills",
      icon: <SparklesIcon className="size-4" />,
      tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
      sparkData: spark([4, 3, 6, 5, 8, 7, 10]),
      sparkColor: "#34d399",
    },
    {
      label: "Featured",
      value: stats.featured,
      hint: "Ditampilkan di homepage",
      href: "/admin/dashboard/projects",
      icon: <Star className="size-4" />,
      tile: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
      sparkData: spark([1, 2, 2, 3, 4, 3, 5]),
      sparkColor: "#fbbf24",
    },
  ]

  const recentProjects = [...projects]
    .sort(
      (a, b) => (a?.sort_order ?? 0) - (b?.sort_order ?? 0)
    )
    .slice(0, 4)

  const completeness = [
    {
      label: "Judul bilingual (ID + EN)",
      value: projects.length
        ? Math.round((stats.bilingual / projects.length) * 100)
        : 0,
      detail: `${stats.bilingual}/${projects.length} projects`,
    },
    {
      label: "Cover image terisi",
      value: projects.length
        ? Math.round((stats.withImage / projects.length) * 100)
        : 0,
      detail: `${stats.withImage}/${projects.length} projects`,
    },
    {
      label: "Link demo terisi",
      value: projects.length
        ? Math.round((stats.withDemo / projects.length) * 100)
        : 0,
      detail: `${stats.withDemo}/${projects.length} projects`,
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* ── Hero ─────────────────────────────────────────── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="hud-corners relative overflow-hidden rounded-2xl border bg-card"
      >
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" />
        <div className="animate-aurora pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="animate-aurora-slow pointer-events-none absolute -right-20 -bottom-28 size-80 rounded-full bg-violet-500/25 blur-3xl" />

        <div className="relative grid gap-6 p-6 md:grid-cols-[1fr_280px] md:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="gap-1.5">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary-foreground/70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary-foreground" />
                </span>
                Admin Console · Portfolio v7
              </Badge>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {formatDateID()}
              </span>
            </div>
            <h1 className="font-display mt-4 max-w-xl text-balance text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              {greeting()}, Salman.
              <span className="text-glow text-signal"> Kontenmu siap gas.</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Kelola projects, experiences, awards, dan skills dalam dua bahasa
              dari satu tempat. Semua perubahan langsung tampil di website
              publik.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Button asChild>
                <Link href="/admin/dashboard/projects">
                  <Plus />
                  Tambah project
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/" target="_blank">
                  <Globe />
                  Lihat situs
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </div>

          {/* Mini terminal / status */}
          <div className="crt relative hidden overflow-hidden rounded-xl border bg-[#04060e] p-4 font-mono text-[11px] leading-relaxed text-cyan-200 md:block">
            <div className="crt-scanlines pointer-events-none absolute inset-0" />
            <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-300/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-white/40">salman@portfolio ~</span>
            </div>
            <div className="space-y-1.5 pt-3">
              <p>
                <span className="text-emerald-300">$</span> portfolio status
              </p>
              <p className="text-white/70">
                ✓ supabase <span className="text-emerald-300">connected</span>
              </p>
              <p className="text-white/70">
                ✓ i18n <span className="text-cyan-300">id + en</span> aktif
              </p>
              <p className="text-white/70">
                ✓ rls <span className="text-violet-300">enforced</span>
              </p>
              <p>
                <span className="text-emerald-300">$</span>{" "}
                <span className="animate-typing-dot inline-block h-3.5 w-1.5 translate-y-0.5 bg-cyan-300" />
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Stat cards ───────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={i + 1}
          >
            <Link href={s.href} className="group block">
              <Card className="relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex size-9 items-center justify-center rounded-lg ${s.tile}`}
                    >
                      {s.icon}
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      Kelola <ArrowRight className="size-3" />
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] font-medium text-muted-foreground">
                    {s.label}
                  </p>
                  {loading ? (
                    <Skeleton className="mt-1 h-9 w-20" />
                  ) : (
                    <p className="tabular mt-0.5 text-3xl font-semibold tracking-tight">
                      {s.value}
                    </p>
                  )}
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <p className="text-xs text-muted-foreground">{s.hint}</p>
                    <div className="h-9 w-24 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={s.sparkData}>
                          <Area
                            type="monotone"
                            dataKey="v"
                            stroke={s.sparkColor}
                            strokeWidth={1.8}
                            fill={s.sparkColor}
                            fillOpacity={0.22}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Charts + recent ──────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[15px]">
                <CircleDot className="size-4 text-signal" />
                Komposisi konten
              </CardTitle>
              <CardDescription>
                Sebaran data yang sudah terisi di CMS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-48 w-full rounded-xl" />
              ) : (
                <>
                  <div className="relative h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donutData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={52}
                          outerRadius={78}
                          paddingAngle={3}
                          cornerRadius={6}
                          strokeWidth={0}
                        >
                          {donutData.map((_, idx) => (
                            <Cell
                              key={idx}
                              fill={DONUT_COLORS[idx % DONUT_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            fontSize: 12,
                            border: "1px solid var(--border)",
                            background: "var(--popover)",
                            color: "var(--popover-foreground)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="tabular text-2xl font-semibold">
                        {projects.length +
                          experiences.length +
                          awards.length +
                          skillGroups.length +
                          stats.totalSkills}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        total item
                      </span>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {donutData.map((d, idx) => (
                      <li
                        key={d.name}
                        className="flex items-center justify-between text-[13px]"
                      >
                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                          <span
                            className="size-2.5 rounded-full"
                            style={{
                              background:
                                DONUT_COLORS[idx % DONUT_COLORS.length],
                            }}
                          />
                          {d.name}
                        </span>
                        <span className="tabular font-semibold">{d.value}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={6}
          className="lg:col-span-3"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-[15px]">
                  <FolderKanbanIcon className="size-4 text-signal" />
                  Project terbaru
                </CardTitle>
                <CardDescription>
                  Urutan sesuai sort_order terkecil.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/dashboard/projects">
                  Semua <ArrowRight />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {loading ? (
                <>
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                  <Skeleton className="h-16 w-full rounded-xl" />
                </>
              ) : recentProjects.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-10 text-center">
                  <LayoutDashboardIcon className="size-6 text-muted-foreground" />
                  <p className="text-sm font-medium">Belum ada project</p>
                  <p className="text-xs text-muted-foreground">
                    Tambahkan project pertamamu sekarang.
                  </p>
                  <Button size="sm" asChild className="mt-1">
                    <Link href="/admin/dashboard/projects">
                      <Plus /> Tambah project
                    </Link>
                  </Button>
                </div>
              ) : (
                recentProjects.map((p) => (
                  <Link
                    key={p.slug}
                    href="/admin/dashboard/projects"
                    className="group flex items-center gap-3 rounded-xl border bg-muted/40 p-3 transition-colors hover:border-signal/50 hover:bg-muted"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/25 to-violet-500/25 font-mono text-sm font-bold text-signal">
                      {(p?.translations?.id?.title?.[0] ||
                        p?.slug?.[0] ||
                        "?")?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {p?.translations?.id?.title || p?.slug}
                        </p>
                        {p?.featured && (
                          <Badge className="gap-1 text-[10px]">
                            <Star className="size-2.5" /> Unggulan
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                        {p?.slug} · {(p?.technologies ?? []).slice(0, 3).join(" · ")}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Completeness + quick actions ─────────────────── */}
      <div className="grid gap-4 lg:grid-cols-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={7}
          className="lg:col-span-3"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[15px]">
                <BadgeCheck className="size-4 text-signal" />
                Kelengkapan konten
              </CardTitle>
              <CardDescription>
                Checklist cepat sebelum publish ke publik.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <Skeleton className="h-24 w-full rounded-xl" />
              ) : (
                completeness.map((c) => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium">{c.label}</span>
                      <span className="tabular text-muted-foreground">
                        {c.detail} · {c.value}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.value}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                      />
                    </div>
                  </div>
                ))
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="secondary" className="gap-1.5">
                  <Languages className="size-3" /> ID + EN
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Database className="size-3" /> Supabase RLS
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Globe className="size-3" /> Auto-publish
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={8}
          className="lg:col-span-2"
        >
          <Card className="h-full overflow-hidden">
            <CardHeader>
              <CardTitle className="text-[15px]">Aksi cepat</CardTitle>
              <CardDescription>Lompat ke tugas paling sering.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {[
                {
                  label: "Project",
                  href: "/admin/dashboard/projects",
                  icon: <FolderKanbanIcon className="size-4" />,
                },
                {
                  label: "Experience",
                  href: "/admin/dashboard/experiences",
                  icon: <BriefcaseBusinessIcon className="size-4" />,
                },
                {
                  label: "Awards",
                  href: "/admin/dashboard/awards",
                  icon: <AwardIcon className="size-4" />,
                },
                {
                  label: "Skills",
                  href: "/admin/dashboard/skills",
                  icon: <SparklesIcon className="size-4" />,
                },
                {
                  label: "Overview",
                  href: "/admin/dashboard",
                  icon: <LayoutDashboardIcon className="size-4" />,
                },
              ].map((a) => (
                <Button
                  key={a.label}
                  variant="outline"
                  asChild
                  className="h-auto flex-col gap-1.5 py-4 hover:border-signal/60 hover:bg-signal/5"
                >
                  <Link href={a.href}>
                    {a.icon}
                    <span className="text-xs">{a.label}</span>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

const DashboardView = ({ title = "Overview", children }: DashboardViewProps) => {
  const isOverview = !children
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative overflow-hidden">
        {/* background decor */}
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]" />
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
                    <h2 className="font-display mt-1 text-2xl font-semibold tracking-tight">
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
