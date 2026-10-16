import DashboardView from "@/view/Admin/Dashboard"

const DashboardSkillsPage = () => {
  return (
    <DashboardView title="Skills">
      <div className="flex-1 rounded-xl bg-muted/50 p-6 md:min-h-min">
        <h1 className="text-xl font-semibold">Skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola daftar skills portofolio di sini.
        </p>
      </div>
    </DashboardView>
  )
}

export default DashboardSkillsPage
