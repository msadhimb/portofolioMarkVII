"use client"

import { useEffect, useId, useState } from "react"
import {
  Controller,
  useFieldArray,
  useForm,
  type Control,
  type FieldErrors,
  type Resolver,
  type UseFormRegister,
} from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  FolderKanban,
  Languages,
  Loader2,
  Plus,
  Save,
  Settings2,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DialogModal } from "@/components/DialogModal"
import { FormInput } from "@/components/Forms/FormInput"
import { FormImageUpload } from "@/components/Forms/FormImageUpload"
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
    umum: (key) => !/^en[A-Z]/.test(key) && !/^id[A-Z]/.test(key),
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
          <div className="grid gap-4 sm:grid-cols-3">
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
          </div>

          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <FormImageUpload
                label="Gambar Sampul"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={isPending}
                hint="Unggah file gambar ke Supabase Storage (JPG, PNG, WebP, SVG) atau masukkan URL manual."
                error={errors.image?.message}
                bucket="projects"
                folder="covers"
              />
            )}
          />
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
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Tagline"
              placeholder="Tagline singkat project"
              disabled={isPending}
              hint="Berlaku untuk semua bahasa."
              error={errors.tagline?.message}
              {...register("tagline")}
            />
            <FormInput
              label="Peran"
              placeholder="Contoh: Frontend Engineer / Solo Builder"
              disabled={isPending}
              hint="Berlaku untuk semua bahasa."
              error={errors.role?.message}
              {...register("role")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormInput
                  label="Periode mulai"
                  type="date"
                  dateMode="month"
                  disabled={isPending}
                  hint="Pilih bulan & tahun mulai."
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
                  label="Periode selesai"
                  type="date"
                  dateMode="month"
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
          <FormInput
            label="Konteks"
            placeholder="Contoh: Produk independen · Supabase + Next.js"
            disabled={isPending}
            hint="Berlaku untuk semua bahasa."
            error={errors.context?.message}
            {...register("context")}
          />
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
            control={control}
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
            control={control}
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
  control: Control<ProjectFormData>
  errors: FieldErrors<ProjectFormData>
  disabled: boolean
}

type LocaleBaseField = "title" | "description" | "problem" | "highlights"

const LocaleFields = ({
  prefix,
  register,
  control,
  errors,
  disabled,
}: LocaleFieldsProps) => {
  const field = (name: LocaleBaseField) =>
    register(`${prefix}${capitalize(name)}` as keyof ProjectFormData)

  const errorOf = (name: LocaleBaseField) =>
    errors[`${prefix}${capitalize(name)}` as keyof ProjectFormData]?.message as
      string | undefined

  const {
    fields: metricFields,
    append: appendMetric,
    remove: removeMetric,
  } = useFieldArray({
    control,
    name: `${prefix}Metrics` as "idMetrics" | "enMetrics",
  })

  const {
    fields: decisionFields,
    append: appendDecision,
    remove: removeDecision,
  } = useFieldArray({
    control,
    name: `${prefix}Decisions` as "idDecisions" | "enDecisions",
  })

  return (
    <div className="space-y-4">
      <FormInput
        label="Judul"
        required
        disabled={disabled}
        error={errorOf("title")}
        {...field("title")}
      />
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
      <FormTextArea
        label="Highlights"
        rows={3}
        disabled={disabled}
        hint="Satu highlight per baris."
        error={errorOf("highlights")}
        {...field("highlights")}
      />

      {/* Array Metrik */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Metrik Proyek</Label>
            <p className="text-xs text-muted-foreground">
              Statistik atau capaian utama (label & nilai).
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => appendMetric({ label: "", value: "" })}
            className="gap-1.5 text-xs"
          >
            <Plus className="size-3.5" /> Tambah metrik
          </Button>
        </div>

        {metricFields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground">
            Belum ada metrik. Klik &ldquo;Tambah metrik&rdquo; jika ingin menambahkan.
          </div>
        ) : (
          <div className="space-y-3">
            {metricFields.map((fieldItem, index) => {
              const currentErrors =
                errors[`${prefix}Metrics` as "idMetrics" | "enMetrics"]?.[index]
              return (
                <div
                  key={fieldItem.id}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3"
                >
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <FormInput
                      label="Label"
                      placeholder="Contoh: Pengguna Aktif"
                      disabled={disabled}
                      error={currentErrors?.label?.message}
                      {...register(
                        `${prefix}Metrics.${index}.label` as unknown as `idMetrics.${number}.label`
                      )}
                    />
                    <FormInput
                      label="Nilai"
                      placeholder="Contoh: 10.000+"
                      disabled={disabled}
                      error={currentErrors?.value?.message}
                      {...register(
                        `${prefix}Metrics.${index}.value` as unknown as `idMetrics.${number}.value`
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => removeMetric(index)}
                    className="mt-7 text-muted-foreground hover:text-destructive shrink-0"
                    title="Hapus metrik"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Array Keputusan */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Keputusan Teknis / Desain</Label>
            <p className="text-xs text-muted-foreground">
              Keputusan arsitektur atau rekayasa (judul & detail).
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => appendDecision({ title: "", detail: "" })}
            className="gap-1.5 text-xs"
          >
            <Plus className="size-3.5" /> Tambah keputusan
          </Button>
        </div>

        {decisionFields.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground">
            Belum ada keputusan. Klik &ldquo;Tambah keputusan&rdquo; jika ingin menambahkan.
          </div>
        ) : (
          <div className="space-y-3">
            {decisionFields.map((fieldItem, index) => {
              const currentErrors =
                errors[`${prefix}Decisions` as "idDecisions" | "enDecisions"]?.[index]
              return (
                <div
                  key={fieldItem.id}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3"
                >
                  <div className="flex-1 space-y-3">
                    <FormInput
                      label="Judul Keputusan"
                      placeholder="Contoh: RLS sebagai garis pertahanan utama"
                      disabled={disabled}
                      error={currentErrors?.title?.message}
                      {...register(
                        `${prefix}Decisions.${index}.title` as unknown as `idDecisions.${number}.title`
                      )}
                    />
                    <FormTextArea
                      label="Detail"
                      placeholder="Penjelasan latar belakang keputusan..."
                      rows={2}
                      disabled={disabled}
                      error={currentErrors?.detail?.message}
                      {...register(
                        `${prefix}Decisions.${index}.detail` as unknown as `idDecisions.${number}.detail`
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    onClick={() => removeDecision(index)}
                    className="mt-7 text-muted-foreground hover:text-destructive shrink-0"
                    title="Hapus keputusan"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)
