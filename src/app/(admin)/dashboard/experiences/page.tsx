import DashboardView from "@/view/Admin/Dashboard"
import { ExperiencesAdminView } from "@/view/Admin/Experiences"

const DashboardExperiencesPage = () => {
  return (
    <DashboardView title="Experiences">
      <ExperiencesAdminView />
    </DashboardView>
  )
}

export default DashboardExperiencesPage
