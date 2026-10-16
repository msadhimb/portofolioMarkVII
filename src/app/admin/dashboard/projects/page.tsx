import DashboardView from "@/view/Admin/Dashboard"

const DashboardProjectsPage = () => {
  return (
    <DashboardView title="Projects">
      <div className="flex-1 rounded-xl bg-muted/50 p-6 md:min-h-min">
        <h1 className="text-xl font-semibold">Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola daftar projects portofolio di sini.
        </p>
      </div>
    </DashboardView>
  )
}

export default DashboardProjectsPage
