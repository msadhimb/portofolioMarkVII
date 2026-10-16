"use client"

import { useMemo, useState } from "react"
import { Controller, useForm, type Resolver } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import { RotateCcw, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FormInput } from "@/components/Forms/FormInput"
import { FormSelect } from "@/components/Forms/FormSelect"
import { FormTextArea } from "@/components/Forms/FormTextArea"
import { siteConfig } from "@/data/profile"
import { contactDefaultValues, type ContactFormData } from "./form"
import { createContactSchema } from "./validation"

const EMAIL_SUBJECT_PREFIX = "Portfolio inquiry"

export const ContactForm = () => {
  const { t } = useTranslation("Contact")
  const [isSent, setIsSent] = useState(false)

  const schema = useMemo(
    () =>
      createContactSchema({
        nameRequired: t("errNameRequired"),
        nameMax: t("errNameMax"),
        emailRequired: t("errEmailRequired"),
        emailInvalid: t("errEmailInvalid"),
        emailMax: t("errEmailMax"),
        needRequired: t("errNeedRequired"),
        messageRequired: t("errMessageRequired"),
        messageMin: t("errMessageMin"),
        messageMax: t("errMessageMax"),
      }),
    [t]
  )

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema) as unknown as Resolver<ContactFormData>,
    defaultValues: contactDefaultValues,
    mode: "onTouched",
  })

  const handleSendMessage = (data: ContactFormData) => {
    const needLabel =
      data.need === "other"
        ? t("needOther")
        : data.need === "fulltime"
          ? t("needFulltime")
          : data.need === "contract"
            ? t("needContract")
            : t("needFreelance")
    const subject = encodeURIComponent(
      `${EMAIL_SUBJECT_PREFIX} [${needLabel}] — ${data.name}`
    )
    const body = encodeURIComponent(
      `${data.message}\n\n—\n${data.name} (${data.email})`
    )
    window.location.assign(
      `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
    )
    setIsSent(true)
  }

  const handleSendAnother = () => {
    reset(contactDefaultValues)
    setIsSent(false)
  }

  const needOptions = [
    { value: "fulltime", label: t("needFulltime") },
    { value: "contract", label: t("needContract") },
    { value: "freelance", label: t("needFreelance") },
    { value: "other", label: t("needOther") },
  ]

  return (
    <Card className="rounded-3xl p-7">
      <h3 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
        {t("formTitle")}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t("formNote")}
      </p>

      {isSent ? (
        <div role="status" className="mt-6 rounded-2xl bg-muted/70 p-5">
          <p className="text-[15px] font-semibold text-foreground">
            {t("sentTitle")}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t("sentNote")}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleSendAnother}
            className="mt-4 rounded-full"
          >
            <RotateCcw className="size-4" />
            {t("sendAnother")}
          </Button>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(handleSendMessage)}
          className="mt-6 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormInput
              label={t("nameLabel")}
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              required
              disabled={isSubmitting}
              error={errors.name?.message}
              {...register("name")}
            />
            <FormInput
              label={t("emailLabel")}
              placeholder={t("emailPlaceholder")}
              type="email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <Controller
            control={control}
            name="need"
            render={({ field }) => (
              <FormSelect
                label={t("needLabel")}
                placeholder={t("needPlaceholder")}
                options={needOptions}
                required
                disabled={isSubmitting}
                error={errors.need?.message}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
          <FormTextArea
            label={t("messageLabel")}
            placeholder={t("messagePlaceholder")}
            rows={5}
            maxLength={2000}
            required
            disabled={isSubmitting}
            error={errors.message?.message}
            hint={t("messageHint")}
            {...register("message")}
          />
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="h-12 rounded-full px-6"
          >
            <Send className="size-4" />
            {isSubmitting ? t("sending") : t("submit")}
          </Button>
        </form>
      )}
    </Card>
  )
}
