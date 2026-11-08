import {
  AwardIcon,
  BriefcaseBusinessIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  SparklesIcon,
} from "lucide-react"

export const QUICK_ACTIONS = [
  {
    label: "Proyek",
    href: "/dashboard/projects",
    icon: <FolderKanbanIcon className="size-4" />,
  },
  {
    label: "Pengalaman",
    href: "/dashboard/experiences",
    icon: <BriefcaseBusinessIcon className="size-4" />,
  },
  {
    label: "Penghargaan",
    href: "/dashboard/awards",
    icon: <AwardIcon className="size-4" />,
  },
  {
    label: "Keahlian",
    href: "/dashboard/skills",
    icon: <SparklesIcon className="size-4" />,
  },
  {
    label: "Ringkasan",
    href: "/dashboard",
    icon: <LayoutDashboardIcon className="size-4" />,
  },
]
