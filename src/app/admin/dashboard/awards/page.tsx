import DashboardView from "@/view/Admin/Dashboard"
import { AwardsAdminView } from "@/view/Admin/Awards"

const DashboardAwardsPage = () => {
  return (
    <DashboardView title="Awards">
      <AwardsAdminView />
    </DashboardView>
  )
}

export default DashboardAwardsPage
