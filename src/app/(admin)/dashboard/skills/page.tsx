import DashboardView from "@/view/Admin/Dashboard"
import { SkillsAdminView } from "@/view/Admin/Skills"

const DashboardSkillsPage = () => {
  return (
    <DashboardView title="Skills">
      <SkillsAdminView />
    </DashboardView>
  )
}

export default DashboardSkillsPage
