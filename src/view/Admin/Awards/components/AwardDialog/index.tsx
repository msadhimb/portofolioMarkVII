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
import { Award, Languages, Loader2, Plus, Save, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogModal } from "@/components/DialogModal"
import { FormInput } from "@/components/Forms/FormInput"
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
  awardDefaultValues,
  awardFormToPayload,
  awardToFormValues,
  type AwardFormData,
} from "../../form"
import { schemaAward } from "../../validation"
import { useCreateAward, useUpdateAward } from "../../hooks/useAwardsMutation"
import { AWARD_CATEGORY_LABELS, type AdminAward } from "../../table/columns"

const CATEGORY_OPTIONS = ["certificate", "award", "honor"].map((value) => ({
  value,
  label: AWARD_CATEGORY_LABELS[value],
}))

type AwardDialogProps = {
  open: boolean
  slug: string | null
  initialData?: AdminAward | null
  onClose: () => void
}

export const AwardDialog = ({
  open,
  slug,
  initialData,
  onClose,
}: AwardDialogProps) => {
  const isEdit = slug !== null
  const formId = `award-form-${useId().replace(/:/g, "")}`
  const { openModalActions } = useActionModal()
  const createMutation = useCreateAward()
  const updateMutation = useUpdateAward()
  const isPending = createMutation.isPending || updateMutation.isPending
  const [tab, setTab] = useState<FormTabKey>("umum")

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AwardFormData>({
    resolver: yupResolver(schemaAward) as unknown as Resolver<AwardFormData>,
    defaultValues: awardDefaultValues,
    mode: "onTouched",
  })

  useEffect(() => {
    if (open) {
      reset(
        initialData ? awardToFormValues(initialData) : awardDefaultValues
      )
    }
  }, [open, initialData, reset])

  const handleClose = () => {
    if (isPending) return
    reset(awardDefaultValues)
    setTab("umum")
    onClose()
  }

  const onSubmit = async (values: AwardFormData) => {
    const payload = awardFormToPayload(
      values,
      isEdit ? slug : values.slug.trim()
    )

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ slug, body: payload })
        openModalActions({
          success: true,
          descText: "Award berhasil diperbarui.",
        })
      } else {
        await createMutation.mutateAsync(payload)
        openModalActions({
          success: true,
          descText: "Award berhasil ditambahkan.",
        })
      }
      reset(awardDefaultValues)
      setTab("umum")
      onClose()
    } catch (error) {
      openModalActions({
        success: false,
        descText: isEdit
          ? "Award gagal diperbarui."
          : "Award gagal ditambahkan.",
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
      icon={<Award />}
      eyebrow={isEdit ? `award · ${slug}` : "award · baru"}
      title={isEdit ? `Ubah award "${slug}"` : "Tambah award"}
      description="Kelola sertifikat, penghargaan, dan honor dalam Bahasa Indonesia dan Inggris sekaligus."
      size="xl"
      tone="amber"
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
                  <Plus /> Tambah award
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
          subtitle="Slug, kategori, tahun & kredensial — berlaku semua bahasa"
          errorCount={errorCounts.umum}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Slug"
              placeholder="aws-cloud-practitioner"
              required
              disabled={isEdit || isPending}
              hint={
                isEdit ? "Slug tidak dapat diubah." : "Huruf kecil, angka, strip."
              }
              error={errors.slug?.message}
              {...register("slug")}
            />
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <FormSelect
                  label="Kategori"
                  required
                  disabled={isPending}
                  options={CATEGORY_OPTIONS}
                  placeholder="Pilih kategori"
                  error={errors.category?.message}
                  value={field.value}
                  onValueChange={field.onChange}
                  name={field.name}
                />
              )}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Tahun terbit"
              placeholder="2024"
              required
              disabled={isPending}
              hint="4 digit, contoh 2024."
              error={errors.issueDate?.message}
              {...register("issueDate")}
            />
            <FormInput
              label="Tahun kadaluarsa"
              placeholder="2026"
              disabled={isPending}
              hint="Kosongkan jika tidak ada."
              error={errors.expiryDate?.message}
              {...register("expiryDate")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Credential ID"
              placeholder="AWS-CCP-992147"
              disabled={isPending}
              hint="Boleh dikosongkan."
              error={errors.credentialId?.message}
              {...register("credentialId")}
            />
            <FormInput
              label="URL kredensial"
              placeholder="https://..."
              disabled={isPending}
              hint="Boleh dikosongkan."
              error={errors.credentialUrl?.message}
              {...register("credentialUrl")}
            />
          </div>
          <FormTextArea
            label="Skills"
            placeholder="Satu skill per baris"
            rows={3}
            disabled={isPending}
            hint="Berlaku untuk semua bahasa. Satu baris = satu skill."
            error={errors.skills?.message}
            {...register("skills")}
          />
        </FormSectionCard>

        <FormSectionCard
          hidden={tab !== "id"}
          icon={<Languages />}
          eyebrow="Langkah 2 · Indonesia"
          title="Bahasa Indonesia"
          subtitle="Judul, penerbit & deskripsi untuk locale ID"
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
          subtitle="Title, issuer & description for the EN locale"
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

type LocaleField = "title" | "issuer" | "description"

type LocaleFieldsProps = {
  prefix: "id" | "en"
  register: UseFormRegister<AwardFormData>
  errors: FieldErrors<AwardFormData>
  disabled: boolean
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

const LocaleFields = ({
  prefix,
  register,
  errors,
  disabled,
}: LocaleFieldsProps) => {
  const field = (name: LocaleField) =>
    register(`${prefix}${capitalize(name)}` as keyof AwardFormData)

  const errorOf = (name: LocaleField) =>
    errors[`${prefix}${capitalize(name)}` as keyof AwardFormData]?.message as
      | string
      | undefined

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
          label="Penerbit"
          required
          disabled={disabled}
          error={errorOf("issuer")}
          {...field("issuer")}
        />
      </div>
      <FormTextArea
        label="Deskripsi"
        rows={4}
        required
        disabled={disabled}
        error={errorOf("description")}
        {...field("description")}
      />
    </div>
  )
}
