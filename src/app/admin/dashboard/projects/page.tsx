import DashboardView from "@/view/Admin/Dashboard"
import { ProjectsAdminView } from "@/view/Admin/Projects"

const DashboardProjectsPage = () => {
  return (
    <DashboardView title="Projects">
      <ProjectsAdminView />
    </DashboardView>
  )
}

export default DashboardProjectsPage
