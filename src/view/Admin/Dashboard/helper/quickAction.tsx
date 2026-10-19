import {
  AwardIcon,
  BriefcaseBusinessIcon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  SparklesIcon,
} from "lucide-react"

export const QUICK_ACTIONS = [
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
]
