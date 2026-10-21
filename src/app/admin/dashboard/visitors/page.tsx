import DashboardView from "@/view/Admin/Dashboard"
import { VisitorsAdminView } from "@/view/Admin/Visitors"

const DashboardVisitorsPage = () => {
  return (
    <DashboardView title="Visitors">
      <VisitorsAdminView />
    </DashboardView>
  )
}

export default DashboardVisitorsPage
