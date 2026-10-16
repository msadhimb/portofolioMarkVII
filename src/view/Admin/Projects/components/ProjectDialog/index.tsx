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
import { FolderKanban, Languages, Loader2, Plus, Save, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogModal } from "@/components/DialogModal"
import { FormInput } from "@/components/Forms/FormInput"
import { FormNumber } from "@/components/Forms/FormNumber"
import { FormSelect } from "@/components/Forms/FormSelect"
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
  projectDefaultValues,
  projectFormToPayload,
  projectToFormValues,
  type ProjectFormData,
} from "../../form"
import { schemaProject } from "../../validation"
import {
  useCreateProject,
  useUpdateProject,
} from "../../hooks/useProjectsMutation"
import type { AdminProject } from "../../table/columns"

type ProjectDialogProps = {
  open: boolean
  slug: string | null
  initialData?: AdminProject | null
  onClose: () => void
}

const FEATURED_OPTIONS = [
  { value: "ya", label: "Ya" },
  { value: "tidak", label: "Tidak" },
]

export const ProjectDialog = ({
  open,
  slug,
  initialData,
  onClose,
}: ProjectDialogProps) => {
  const isEdit = slug !== null
  const formId = `project-form-${useId().replace(/:/g, "")}`
  const { openModalActions } = useActionModal()
  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()
  const isPending = createMutation.isPending || updateMutation.isPending
  const [tab, setTab] = useState<FormTabKey>("umum")

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: yupResolver(
      schemaProject
    ) as unknown as Resolver<ProjectFormData>,
    defaultValues: projectDefaultValues,
    mode: "onTouched",
  })

  useEffect(() => {
    if (open) {
      reset(
        initialData ? projectToFormValues(initialData) : projectDefaultValues
      )
    }
  }, [open, initialData, reset])

  const handleClose = () => {
    if (isPending) return
    reset(projectDefaultValues)
    setTab("umum")
    onClose()
  }

  const onSubmit = async (values: ProjectFormData) => {
    const payload = projectFormToPayload(
      values,
      isEdit ? slug : values.slug.trim()
    )

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ slug, body: payload })
        openModalActions({
          success: true,
          descText: "Project berhasil diperbarui.",
        })
      } else {
        await createMutation.mutateAsync(payload)
        openModalActions({
          success: true,
          descText: "Project berhasil ditambahkan.",
        })
      }
      reset(projectDefaultValues)
      setTab("umum")
      onClose()
    } catch (error) {
      openModalActions({
        success: false,
        descText: isEdit
          ? "Project gagal diperbarui."
          : "Project gagal ditambahkan.",
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
      icon={<FolderKanban />}
      eyebrow={isEdit ? `project · ${slug}` : "project · baru"}
      title={isEdit ? `Ubah project "${slug}"` : "Tambah project"}
      description="Kelola konten project dalam Bahasa Indonesia dan Inggris sekaligus."
      size="xl"
      tone="cyan"
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
                  <Plus /> Tambah project
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
          subtitle="Identitas & tautan — berlaku untuk semua bahasa"
          errorCount={errorCounts.umum}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Slug"
              placeholder="nama-project"
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
            <Controller
              control={control}
              name="sortOrder"
              render={({ field }) => (
                <FormNumber
                  label="Urutan"
                  min={0}
                  required
                  disabled={isPending}
                  error={errors.sortOrder?.message}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <FormSelect
                  label="Unggulan"
                  options={FEATURED_OPTIONS}
                  required
                  disabled={isPending}
                  error={errors.featured?.message}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            />
            <FormInput
              label="Gambar"
              placeholder="/images/project.svg"
              disabled={isPending}
              hint="Path atau URL gambar. Boleh dikosongkan."
              error={errors.image?.message}
              {...register("image")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="URL demo"
              placeholder="https://..."
              disabled={isPending}
              error={errors.demoUrl?.message}
              {...register("demoUrl")}
            />
            <FormInput
              label="URL repositori"
              placeholder="https://..."
              disabled={isPending}
              error={errors.repositoryUrl?.message}
              {...register("repositoryUrl")}
            />
          </div>
          <FormTextArea
            label="Teknologi"
            placeholder="Satu teknologi per baris"
            rows={3}
            disabled={isPending}
            hint="Berlaku untuk semua bahasa. Satu baris = satu teknologi."
            error={errors.technologies?.message}
            {...register("technologies")}
          />
        </FormSectionCard>

        <FormSectionCard
          hidden={tab !== "id"}
          icon={<Languages />}
          eyebrow="Langkah 2 · Indonesia"
          title="Bahasa Indonesia"
          subtitle="Konten utama yang tampil untuk locale ID"
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
          subtitle="Mirror content for the EN locale"
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

type LocaleFieldsProps = {
  prefix: "id" | "en"
  register: UseFormRegister<ProjectFormData>
  errors: FieldErrors<ProjectFormData>
  disabled: boolean
}

type LocaleBaseField =
  | "title"
  | "tagline"
  | "description"
  | "problem"
  | "role"
  | "period"
  | "context"
  | "highlights"
  | "metrics"
  | "decisions"

const LocaleFields = ({
  prefix,
  register,
  errors,
  disabled,
}: LocaleFieldsProps) => {
  const field = (name: LocaleBaseField) =>
    register(`${prefix}${capitalize(name)}` as keyof ProjectFormData)

  const errorOf = (name: LocaleBaseField) =>
    errors[`${prefix}${capitalize(name)}` as keyof ProjectFormData]?.message as
      string | undefined

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Judul"
          required
          disabled={disabled}
          error={errorOf("title")}
          {...field("title")}
        />
        <FormInput
          label="Tagline"
          disabled={disabled}
          error={errorOf("tagline")}
          {...field("tagline")}
        />
      </div>
      <FormTextArea
        label="Deskripsi"
        rows={3}
        disabled={disabled}
        error={errorOf("description")}
        {...field("description")}
      />
      <FormTextArea
        label="Masalah"
        rows={3}
        disabled={disabled}
        error={errorOf("problem")}
        {...field("problem")}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <FormInput
          label="Peran"
          disabled={disabled}
          error={errorOf("role")}
          {...field("role")}
        />
        <FormInput
          label="Periode"
          placeholder="2023 — Sekarang"
          disabled={disabled}
          error={errorOf("period")}
          {...field("period")}
        />
        <FormInput
          label="Konteks"
          disabled={disabled}
          error={errorOf("context")}
          {...field("context")}
        />
      </div>
      <FormTextArea
        label="Highlights"
        rows={3}
        disabled={disabled}
        hint="Satu highlight per baris."
        error={errorOf("highlights")}
        {...field("highlights")}
      />
      <FormTextArea
        label="Metrik"
        rows={3}
        disabled={disabled}
        hint='Satu metrik per baris dengan format "label | nilai".'
        error={errorOf("metrics")}
        {...field("metrics")}
      />
      <FormTextArea
        label="Keputusan"
        rows={3}
        disabled={disabled}
        hint='Satu keputusan per baris dengan format "judul | detail".'
        error={errorOf("decisions")}
        {...field("decisions")}
      />
    </div>
  )
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)
