"use client"

import { useEffect, useId, useState } from "react"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Languages, Layers, Loader2, Plus, Save, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogModal } from "@/components/DialogModal"
import { FormInput } from "@/components/Forms/FormInput"
import { FormNumber } from "@/components/Forms/FormNumber"
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
  skillGroupDefaultValues,
  skillGroupFormToPayload,
  skillGroupToFormValues,
  type SkillGroupFormData,
} from "../../form"
import { schemaSkillGroup } from "../../validation"
import {
  useCreateSkillGroup,
  useUpdateSkillGroup,
} from "../../hooks/useSkillsMutation"
import type { AdminSkillGroup } from "../../table/columns"

type SkillGroupDialogProps = {
  open: boolean
  slug: string | null
  initialData?: AdminSkillGroup | null
  onClose: () => void
}

export const SkillGroupDialog = ({
  open,
  slug,
  initialData,
  onClose,
}: SkillGroupDialogProps) => {
  const isEdit = slug !== null
  const formId = `skill-group-form-${useId().replace(/:/g, "")}`
  const { openModalActions } = useActionModal()
  const createMutation = useCreateSkillGroup()
  const updateMutation = useUpdateSkillGroup()
  const isPending = createMutation.isPending || updateMutation.isPending
  const [tab, setTab] = useState<FormTabKey>("umum")

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillGroupFormData>({
    resolver: yupResolver(
      schemaSkillGroup
    ) as unknown as Resolver<SkillGroupFormData>,
    defaultValues: skillGroupDefaultValues,
    mode: "onTouched",
  })

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? skillGroupToFormValues(initialData)
          : skillGroupDefaultValues
      )
    }
  }, [open, initialData, reset])

  const handleClose = () => {
    if (isPending) return
    reset(skillGroupDefaultValues)
    setTab("umum")
    onClose()
  }

  const onSubmit = async (values: SkillGroupFormData) => {
    const payload = skillGroupFormToPayload(
      values,
      isEdit ? slug : values.slug.trim()
    )

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ slug, body: payload })
        openModalActions({
          success: true,
          descText: "Skill group berhasil diperbarui.",
        })
      } else {
        await createMutation.mutateAsync(payload)
        openModalActions({
          success: true,
          descText: "Skill group berhasil ditambahkan.",
        })
      }
      reset(skillGroupDefaultValues)
      setTab("umum")
      onClose()
    } catch (error) {
      openModalActions({
        success: false,
        descText: isEdit
          ? "Skill group gagal diperbarui."
          : "Skill group gagal ditambahkan.",
        infoText: getErrorMessage(error, "Periksa isian form lalu coba lagi."),
      })
    }
  }

  const errorCounts = countErrorsByPrefix(errors as Record<string, unknown>, {
    en: (key) => key.startsWith("en"),
    id: (key) => key.startsWith("id"),
    umum: () => true,
  })
  const totalErrors = Object.keys(errors).length

  return (
    <DialogModal
      open={open}
      onClose={handleClose}
      icon={<Sparkles />}
      eyebrow={isEdit ? `skill group · ${slug}` : "skill group · baru"}
      title={isEdit ? `Ubah skill group "${slug}"` : "Tambah skill group"}
      description="Kelola grup skill dalam Bahasa Indonesia dan Inggris sekaligus."
      size="lg"
      tone="emerald"
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
                  <Plus /> Tambah skill group
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
          icon={<Layers />}
          eyebrow="Langkah 1 · umum"
          title="Data umum"
          subtitle="Slug, urutan & daftar skill — berlaku semua bahasa"
          errorCount={errorCounts.umum}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Slug"
              placeholder="frontend"
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
          <FormTextArea
            label="Items"
            placeholder="Satu skill per baris"
            rows={5}
            disabled={isPending}
            hint="Berlaku untuk semua bahasa. Satu baris = satu skill."
            error={errors.items?.message}
            {...register("items")}
          />
        </FormSectionCard>

        <FormSectionCard
          hidden={tab !== "id"}
          icon={<Languages />}
          eyebrow="Langkah 2 · Indonesia"
          title="Bahasa Indonesia"
          subtitle="Judul & catatan untuk locale ID"
          errorCount={errorCounts.id}
        >
          <FormInput
            label="Judul"
            required
            disabled={isPending}
            error={errors.idTitle?.message}
            {...register("idTitle")}
          />
          <FormTextArea
            label="Catatan"
            rows={2}
            disabled={isPending}
            error={errors.idNote?.message}
            {...register("idNote")}
          />
        </FormSectionCard>

        <FormSectionCard
          hidden={tab !== "en"}
          icon={<Languages />}
          eyebrow="Langkah 3 · English"
          title="English"
          subtitle="Title & note for the EN locale"
          errorCount={errorCounts.en}
        >
          <FormInput
            label="Judul"
            required
            disabled={isPending}
            error={errors.enTitle?.message}
            {...register("enTitle")}
          />
          <FormTextArea
            label="Catatan"
            rows={2}
            disabled={isPending}
            error={errors.enNote?.message}
            {...register("enNote")}
          />
        </FormSectionCard>
      </form>
    </DialogModal>
  )
}
