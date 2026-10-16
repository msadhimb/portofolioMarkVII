"use client"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { FormInput } from "@/components/Forms/FormInput"
import { yupResolver } from "@hookform/resolvers/yup"
import { schemaLogin, type ILogin } from "./validations"
import { createClient } from "@/lib/supabase/client"
import { useActionModal } from "@/components/ActionModal/store"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

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
        descText: "Login berhasil.",
        onConfirm: () => {
          router.refresh()
          router.replace("/admin/dashboard")
        },
      })
    },
    onError: () => {
      openModalActions({
        descText: "Login gagal.",
        success: false,
      })
    },
  })

  const isPending = loginMutation.isPending

  const onSubmit = (data: ILogin) => {
    loginMutation.mutate(data)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <FieldGroup className="space-y-8 p-6 md:px-10 md:py-24">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-balance text-muted-foreground">
                Login to your Acme Inc account
              </p>
            </div>
            <div className="space-y-10">
              <div className="space-y-5">
                <Field>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormInput
                        label="Email"
                        placeholder="[EMAIL_ADDRESS]"
                        required
                        type="email"
                        error={errors.email?.message}
                        {...field}
                      />
                    )}
                  />
                </Field>
                <Field>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormInput
                        label="Password"
                        placeholder="Password"
                        required
                        type="password"
                        error={errors.password?.message}
                        {...field}
                      />
                    )}
                  />
                </Field>
              </div>
              <Field>
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>
            </div>
          </FieldGroup>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/placeholder.svg"
              alt="Image"
              width={1000}
              height={1000}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

export default LoginView
