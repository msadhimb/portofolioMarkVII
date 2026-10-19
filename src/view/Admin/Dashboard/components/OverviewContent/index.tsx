import { unwrapList } from "@/lib/pagination"
import { useAdminAwards } from "@/view/Admin/Awards/store"
import { useAdminExperiences } from "@/view/Admin/Experiences/store"
import { useAdminProjects } from "@/view/Admin/Projects/store"
import { useAdminSkills } from "@/view/Admin/Skills/store"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
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
  PieChart,
  Plus,
  SparklesIcon,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Cell, Pie, ResponsiveContainer, Tooltip } from "recharts"
import { spark } from "../../helper/spark"
import { fadeUp } from "../../helper/fadeUp"
import { greeting } from "../../helper/greeting"
import StatCard from "../StateCard"
import { DONUT_COLORS } from "../../helper/colors"
import RecentProjectItem from "../RecentProjectItem"
import CompletenessBar from "../CompletnessBar"
import { QUICK_ACTIONS } from "../../helper/quickAction"
import CvCard from "../CvCard"
import { formatDateID } from "../../helper/formatDateID"

type AdminProjectLike = {
  slug: string
  featured?: boolean
  image?: string | null
  demo_url?: string | null
  title?: string
  technologies?: string[]
  translations?: Record<string, { description?: string }>
}

type AdminSkillGroupLike = { items?: string[] }

const OverviewContent = () => {
  const { getAdminProjects } = useAdminProjects()
  const { getAdminExperiences } = useAdminExperiences()
  const { getAdminAwards } = useAdminAwards()
  const { getAdminSkillGroups } = useAdminSkills()

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
      (p) =>
        p?.translations?.id?.description && p?.translations?.en?.description
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

  const statCards = [
    {
      label: "Projects",
      value: projects.length,
      hint: `${stats.featured} unggulan · ${stats.bilingual} bilingual`,
      href: "/admin/dashboard/projects",
      icon: <FolderKanbanIcon className="size-4" />,
      tile: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
      sparkData: spark([3, 5, 4, 7, 6, 9, 8]),
      sparkColor: "#f59e0b",
    },
    {
      label: "Experiences",
      value: experiences.length,
      hint: "Riwayat kerja & peran",
      href: "/admin/dashboard/experiences",
      icon: <BriefcaseBusinessIcon className="size-4" />,
      tile: "bg-teal-500/15 text-teal-600 dark:text-teal-300",
      sparkData: spark([2, 3, 5, 4, 6, 5, 7]),
      sparkColor: "#2dd4bf",
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

  const recentProjects = projects.slice(0, 4)
  const totalItems =
    projects.length +
    experiences.length +
    awards.length +
    skillGroups.length +
    stats.totalSkills

  return (
    <div className="flex flex-col gap-5">
      {/* ── Hero ── */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="hud-corners relative overflow-hidden rounded-2xl border bg-card"
      >
        <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0" />
        <div className="animate-aurora pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="animate-aurora-slow pointer-events-none absolute -right-20 -bottom-28 size-80 rounded-full bg-teal-500/25 blur-3xl" />
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
            <h1 className="mt-4 max-w-xl font-display text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
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

          {/* Mini terminal */}
          <div className="crt relative hidden overflow-hidden rounded-xl border bg-[#141311] p-4 font-mono text-[11px] leading-relaxed text-amber-200 md:block">
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

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((s, i) => (
          <StatCard key={s.label} {...s} loading={loading} custom={i + 1} />
        ))}
      </div>

      {/* ── Charts + recent ── */}
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
                        {totalItems}
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
                <CardDescription>Urutan terbaru di atas.</CardDescription>
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
                  <RecentProjectItem key={p.slug} p={p} />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Completeness + quick actions ── */}
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
                  <CompletenessBar key={c.label} {...c} />
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
              {QUICK_ACTIONS.map((a) => (
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

      {/* ── CV Manager ── */}
      <CvCard />
    </div>
  )
}

export default OverviewContent
