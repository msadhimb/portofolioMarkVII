import LoginView from "@/view/Admin/Login"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <LoginView />
      </div>
    </div>
  )
}
