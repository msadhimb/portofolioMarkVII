"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { FormInput } from "@/components/Forms/FormInput"
import { yupResolver } from "@hookform/resolvers/yup"
import { schemaLogin, type ILogin } from "./validations"
import { createClient } from "@/lib/supabase/client"
import { useActionModal } from "@/components/ActionModal/store"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeft, Loader2 } from "lucide-react"

const LoginView = ({ className, ...props }: React.ComponentProps<"div">) => {
  const router = useRouter()
  const { openModalActions } = useActionModal()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    resolver: yupResolver(schemaLogin),
  })

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: ILogin) => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    },
    onSuccess: () => {
      openModalActions({
        success: true,
        descText: "Berhasil masuk.",
        onConfirm: () => {
          router.refresh()
          router.replace("/dashboard")
        },
      })
    },
    onError: () => {
      openModalActions({
        descText: "Email atau kata sandi salah.",
        success: false,
      })
    },
  })

  const isPending = loginMutation.isPending

  const onSubmit = (data: ILogin) => {
    loginMutation.mutate(data)
  }

  return (
    <div
      className={cn(
        "glass-panel overflow-hidden rounded-[24px] border",
        className
      )}
      {...props}
    >
      <div className="grid md:grid-cols-[1fr_1.1fr]">
        <div className="hidden flex-col justify-between bg-foreground p-10 text-background md:flex">
          <div>
            <p className="font-mono text-[9px] tracking-[0.22em] text-background/50 uppercase">
              Admin
            </p>
            <p className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-[-0.03em] text-background">
              salman<span className="text-signal">.</span>adhim
            </p>
          </div>
          <div>
            <p className="max-w-xs font-display text-xl leading-snug text-background/75 italic">
              “Konten yang rapi dimulai dari satu tempat.”
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-background/60 uppercase transition-colors hover:text-background"
            >
              <ArrowLeft className="size-3.5" />
              Kembali ke situs
            </Link>
          </div>
        </div>

        <div className="p-6 sm:p-10 md:p-12">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-signal md:hidden"
          >
            <ArrowLeft className="size-3.5" />
            Kembali ke situs
          </Link>

          <p className="font-mono text-[9px] tracking-[0.22em] text-signal uppercase">
            Masuk
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-[-0.02em] text-foreground">
            Selamat datang kembali
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            Masuk untuk mengelola konten portofolio.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormInput
                  label="Email"
                  placeholder="nama@email.com"
                  required
                  type="email"
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label="Kata sandi"
                  placeholder="••••••••"
                  required
                  type="password"
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Memproses…
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginView
