import Grid from "@/components/Background/Grid"
import LoginView from "@/view/Admin/Login"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Grid />
      <div className="relative z-10 w-full max-w-sm md:max-w-4xl">
        <LoginView />
      </div>
    </div>
  )
}
