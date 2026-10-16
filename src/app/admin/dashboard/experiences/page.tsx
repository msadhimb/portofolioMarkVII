import DashboardView from "@/view/Admin/Dashboard"

const DashboardExperiencesPage = () => {
  return (
    <DashboardView title="Experiences">
      <div className="flex-1 rounded-xl bg-muted/50 p-6 md:min-h-min">
        <h1 className="text-xl font-semibold">Experiences</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola riwayat pengalaman kerja di sini.
        </p>
      </div>
    </DashboardView>
  )
}

export default DashboardExperiencesPage
