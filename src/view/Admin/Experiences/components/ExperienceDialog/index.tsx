"use client"

import { useEffect, useId, useState } from "react"
import {
  Controller,
  useForm,
  type FieldErrors,
  type Resolver,
  type UseFormRegister,
} from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { BriefcaseBusiness, Languages, Loader2, Plus, Save, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogModal } from "@/components/DialogModal"
import { FormInput } from "@/components/Forms/FormInput"
import { FormTextArea } from "@/components/Forms/FormTextArea"
import { useActionModal } from "@/components/ActionModal/store"
import { getErrorMessage } from "@/view/Admin/components/getErrorMessage"
import {
  FormSectionCard,
  FormTabBar,
  countErrorsByPrefix,
  type FormTabKey,
} from "@/view/Admin/components/FormParts"
import {
  experienceDefaultValues,
  experienceFormToPayload,
  experienceToFormValues,
  type ExperienceFormData,
} from "../../form"
import { schemaExperience } from "../../validation"
import {
  useCreateExperience,
  useUpdateExperience,
} from "../../hooks/useExperiencesMutation"
import type { AdminExperience } from "../../table/columns"

type ExperienceDialogProps = {
  open: boolean
  slug: string | null
  initialData?: AdminExperience | null
  onClose: () => void
}

export const ExperienceDialog = ({
  open,
  slug,
  initialData,
  onClose,
}: ExperienceDialogProps) => {
  const isEdit = slug !== null
  const formId = `experience-form-${useId().replace(/:/g, "")}`
  const { openModalActions } = useActionModal()
  const createMutation = useCreateExperience()
  const updateMutation = useUpdateExperience()
  const isPending = createMutation.isPending || updateMutation.isPending
  const [tab, setTab] = useState<FormTabKey>("umum")

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: yupResolver(
      schemaExperience
    ) as unknown as Resolver<ExperienceFormData>,
    defaultValues: experienceDefaultValues,
    mode: "onTouched",
  })

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? experienceToFormValues(initialData)
          : experienceDefaultValues
      )
    }
  }, [open, initialData, reset])

  const handleClose = () => {
    if (isPending) return
    reset(experienceDefaultValues)
    setTab("umum")
    onClose()
  }

  const onSubmit = async (values: ExperienceFormData) => {
    const payload = experienceFormToPayload(
      values,
      isEdit ? slug : values.slug.trim()
    )

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ slug, body: payload })
        openModalActions({
          success: true,
          descText: "Experience berhasil diperbarui.",
        })
      } else {
        await createMutation.mutateAsync(payload)
        openModalActions({
          success: true,
          descText: "Experience berhasil ditambahkan.",
        })
      }
      reset(experienceDefaultValues)
      setTab("umum")
      onClose()
    } catch (error) {
      openModalActions({
        success: false,
        descText: isEdit
          ? "Experience gagal diperbarui."
          : "Experience gagal ditambahkan.",
        infoText: getErrorMessage(error, "Periksa isian form lalu coba lagi."),
      })
    }
  }

  const errorCounts = countErrorsByPrefix(errors as Record<string, unknown>, {
    en: (key) => /^en[A-Z]/.test(key),
    id: (key) => /^id[A-Z]/.test(key),
    umum: () => true,
  })
  const totalErrors = Object.keys(errors).length

  return (
    <DialogModal
      open={open}
      onClose={handleClose}
      icon={<BriefcaseBusiness />}
      eyebrow={isEdit ? `experience · ${slug}` : "experience · baru"}
      title={isEdit ? `Ubah experience "${slug}"` : "Tambah experience"}
      description="Kelola riwayat pengalaman dalam Bahasa Indonesia dan Inggris sekaligus."
      size="xl"
      tone="violet"
      dismissible={!isPending}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-muted-foreground">
            {totalErrors > 0 ? (
              <span className="font-semibold text-destructive">
                {totalErrors} field perlu perhatian
              </span>
            ) : (
              "ID + EN tersimpan sekaligus"
            )}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={handleClose}
            >
              Batal
            </Button>
            <Button type="submit" form={formId} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Menyimpan...
                </>
              ) : isEdit ? (
                <>
                  <Save /> Simpan perubahan
                </>
              ) : (
                <>
                  <Plus /> Tambah experience
                </>
              )}
            </Button>
          </div>
        </div>
      }
    >
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <FormTabBar active={tab} onChange={setTab} errorCounts={errorCounts} />

        <FormSectionCard
          hidden={tab !== "umum"}
          icon={<Settings2 />}
          eyebrow="Langkah 1 · umum"
          title="Data umum"
          subtitle="Slug, periode tanggal & stack — berlaku semua bahasa"
          errorCount={errorCounts.umum}
        >
          <div className="grid gap-4">
            <FormInput
              label="Slug"
              placeholder="nama-perusahaan"
              required
              disabled={isEdit || isPending}
              hint={
                isEdit
                  ? "Slug tidak dapat diubah."
                  : "Huruf kecil, angka, strip."
              }
              error={errors.slug?.message}
              {...register("slug")}
            />
          </div>
          <FormInput
            label="Organisasi"
            required
            disabled={isPending}
            error={errors.org?.message}
            {...register("org")}
            className="col-span-2"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormInput
                  label="Tanggal mulai"
                  type="date"
                  disabled={isPending}
                  hint="Boleh dikosongkan."
                  error={errors.startDate?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormInput
                  label="Tanggal selesai"
                  type="date"
                  disabled={isPending}
                  hint="Kosongkan jika masih berjalan."
                  error={errors.endDate?.message}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>
          <FormTextArea
            label="Stack"
            placeholder="Satu stack per baris"
            rows={3}
            disabled={isPending}
            hint="Berlaku untuk semua bahasa. Satu baris = satu stack."
            error={errors.stacks?.message}
            {...register("stacks")}
          />
        </FormSectionCard>

        <FormSectionCard
          hidden={tab !== "id"}
          icon={<Languages />}
          eyebrow="Langkah 2 · Indonesia"
          title="Bahasa Indonesia"
          subtitle="Peran & pencapaian untuk locale ID"
          errorCount={errorCounts.id}
        >
          <LocaleFields
            prefix="id"
            register={register}
            errors={errors}
            disabled={isPending}
          />
        </FormSectionCard>

        <FormSectionCard
          hidden={tab !== "en"}
          icon={<Languages />}
          eyebrow="Langkah 3 · English"
          title="English"
          subtitle="Role & achievements for the EN locale"
          errorCount={errorCounts.en}
        >
          <LocaleFields
            prefix="en"
            register={register}
            errors={errors}
            disabled={isPending}
          />
        </FormSectionCard>
      </form>
    </DialogModal>
  )
}

type LocaleBaseField = "period" | "role" | "org" | "context" | "points"

type LocaleFieldsProps = {
  prefix: "id" | "en"
  register: UseFormRegister<ExperienceFormData>
  errors: FieldErrors<ExperienceFormData>
  disabled: boolean
}

const LocaleFields = ({
  prefix,
  register,
  errors,
  disabled,
}: LocaleFieldsProps) => {
  const field = (name: LocaleBaseField) =>
    register(`${prefix}${capitalize(name)}` as keyof ExperienceFormData)

  const errorOf = (name: LocaleBaseField) =>
    errors[`${prefix}${capitalize(name)}` as keyof ExperienceFormData]
      ?.message as string | undefined

  const required = true

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Peran"
          required={required}
          disabled={disabled}
          error={errorOf("role")}
          {...field("role")}
        />
        <FormInput
          label="Konteks"
          disabled={disabled}
          error={errorOf("context")}
          {...field("context")}
        />
      </div>
      <FormTextArea
        label="Poin pencapaian"
        rows={4}
        disabled={disabled}
        hint="Satu poin per baris."
        error={errorOf("points")}
        {...field("points")}
      />
    </div>
  )
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)
