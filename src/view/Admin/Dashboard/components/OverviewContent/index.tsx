import { unwrapList } from "@/lib/pagination"
import { useAdminAwards } from "@/view/Admin/Awards/store"
import { useAdminExperiences } from "@/view/Admin/Experiences/store"
import { useAdminProjects } from "@/view/Admin/Projects/store"
import { useAdminSkills } from "@/view/Admin/Skills/store"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  AwardIcon,
  BadgeCheck,
  BriefcaseBusinessIcon,
  CircleDot,
  FolderKanbanIcon,
  Globe,
  LayoutDashboardIcon,
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
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
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
      { name: "Proyek", value: projects.length },
      { name: "Pengalaman", value: experiences.length },
      { name: "Penghargaan", value: awards.length },
      { name: "Grup skill", value: skillGroups.length },
      { name: "Item skill", value: stats.totalSkills },
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
      label: "Proyek",
      value: projects.length,
      hint: `${stats.featured} unggulan · ${stats.bilingual} bilingual`,
      href: "/dashboard/projects",
      icon: <FolderKanbanIcon className="size-4" />,
    },
    {
      label: "Pengalaman",
      value: experiences.length,
      hint: "Riwayat kerja & peran",
      href: "/dashboard/experiences",
      icon: <BriefcaseBusinessIcon className="size-4" />,
    },
    {
      label: "Penghargaan",
      value: awards.length,
      hint: "Sertifikat, penghargaan & honor",
      href: "/dashboard/awards",
      icon: <AwardIcon className="size-4" />,
    },
    {
      label: "Grup skill",
      value: skillGroups.length,
      hint: `${stats.totalSkills} item skill`,
      href: "/dashboard/skills",
      icon: <SparklesIcon className="size-4" />,
    },
    {
      label: "Unggulan",
      value: stats.featured,
      hint: "Tampil di halaman utama",
      href: "/dashboard/projects",
      icon: <Star className="size-4" />,
    },
  ]

  const completeness = [
    {
      label: "Judul bilingual (ID + EN)",
      value: projects.length
        ? Math.round((stats.bilingual / projects.length) * 100)
        : 0,
      detail: `${stats.bilingual}/${projects.length}`,
    },
    {
      label: "Cover image terisi",
      value: projects.length
        ? Math.round((stats.withImage / projects.length) * 100)
        : 0,
      detail: `${stats.withImage}/${projects.length}`,
    },
    {
      label: "Link demo terisi",
      value: projects.length
        ? Math.round((stats.withDemo / projects.length) * 100)
        : 0,
      detail: `${stats.withDemo}/${projects.length}`,
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
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="glass-panel rounded-xl border p-6 md:p-8"
      >
        <div className="grid gap-8 md:grid-cols-[1fr_220px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] text-signal uppercase">
                <span className="size-1.5 rounded-full bg-signal" />
                Admin console
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {formatDateID()}
              </span>
            </div>
            <h1 className="mt-4 max-w-xl text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.03em] text-balance text-foreground">
              {greeting()}, Salman.
            </h1>
            <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted-foreground">
              Kelola proyek, pengalaman, penghargaan, dan keahlian dalam dua
              bahasa. Semua perubahan langsung tampil di situs publik.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Button asChild>
                <Link href="/dashboard/projects">
                  <Plus />
                  Tambah proyek
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/" target="_blank">
                  <Globe />
                  Lihat situs
                </Link>
              </Button>
            </div>
          </div>

          <div className="border-t border-border pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6">
            <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
              Status
            </p>
            <dl className="mt-3 space-y-2">
              {[
                ["supabase", "connected"],
                ["i18n", "id + en"],
                ["rls", "enforced"],
              ].map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-3 border-b border-border pb-2 font-mono text-[11px] last:border-b-0"
                >
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat, index) => (
          <StatCard
            key={stat.label}
            {...stat}
            loading={loading}
            custom={index + 1}
          />
        ))}
      </div>

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
              <CardTitle className="flex items-center gap-2 text-[14px]">
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
                          cornerRadius={4}
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
                            borderRadius: 10,
                            fontSize: 12,
                            border: "1px solid var(--border)",
                            background: "var(--popover)",
                            color: "var(--popover-foreground)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="tabular text-2xl font-medium">
                        {totalItems}
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                        total item
                      </span>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {donutData.map((entry, idx) => (
                      <li
                        key={entry.name}
                        className="flex items-center justify-between text-[12px]"
                      >
                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                          <span
                            className="size-2 rounded-full"
                            style={{
                              background:
                                DONUT_COLORS[idx % DONUT_COLORS.length],
                            }}
                          />
                          {entry.name}
                        </span>
                        <span className="tabular font-mono">{entry.value}</span>
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
                <CardTitle className="flex items-center gap-2 text-[14px]">
                  <FolderKanbanIcon className="size-4 text-signal" />
                  Proyek terbaru
                </CardTitle>
                <CardDescription>Urutan terbaru di atas.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/projects">
                  Semua <ArrowRight />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2.5">
                  <Skeleton className="h-14 w-full rounded-lg" />
                  <Skeleton className="h-14 w-full rounded-lg" />
                  <Skeleton className="h-14 w-full rounded-lg" />
                </div>
              ) : recentProjects.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-10 text-center">
                  <LayoutDashboardIcon className="size-6 text-muted-foreground" />
                  <p className="text-sm font-medium">Belum ada proyek</p>
                  <p className="text-xs text-muted-foreground">
                    Tambahkan proyek pertamamu sekarang.
                  </p>
                  <Button size="sm" asChild className="mt-1">
                    <Link href="/dashboard/projects">
                      <Plus /> Tambah proyek
                    </Link>
                  </Button>
                </div>
              ) : (
                recentProjects.map((project) => (
                  <RecentProjectItem key={project.slug} p={project} />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

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
              <CardTitle className="flex items-center gap-2 text-[14px]">
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
                completeness.map((item) => (
                  <CompletenessBar key={item.label} {...item} />
                ))
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {["ID + EN", "Supabase RLS", "Auto-publish"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    {chip}
                  </span>
                ))}
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
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-[14px]">Aksi cepat</CardTitle>
              <CardDescription>Lompat ke tugas paling sering.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  asChild
                  className="h-auto flex-col gap-1.5 py-4 hover:border-signal/60 hover:text-signal"
                >
                  <Link href={action.href}>
                    {action.icon}
                    <span className="font-mono text-[10px]">
                      {action.label}
                    </span>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <CvCard />
    </div>
  )
}

export default OverviewContent
