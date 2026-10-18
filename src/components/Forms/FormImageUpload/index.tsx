"use client"

import { useId, useRef, useState } from "react"
import {
  CheckCircle2,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type FormImageUploadProps = {
  label: string
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  disabled?: boolean
  error?: string
  hint?: string
  required?: boolean
  className?: string
  bucket?: string
  folder?: string
}

export const FormImageUpload = ({
  label,
  value = "",
  onChange,
  onBlur,
  disabled = false,
  error,
  hint,
  required,
  className,
  bucket = "projects",
  folder = "covers",
}: FormImageUploadProps) => {
  const autoId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mode, setMode] = useState<"upload" | "url">("upload")

  const handleUpload = async (file: File) => {
    if (!file) return

    // Validasi tipe file
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
    ]
    if (!validTypes.includes(file.type)) {
      setUploadError(
        "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau SVG."
      )
      return
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Ukuran file terlalu besar. Maksimal 5 MB.")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const supabase = createClient()
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const cleanBaseName = file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 30)
      const fileName = `${cleanBaseName}-${Date.now()}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadErr) {
        throw uploadErr
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      onChange(publicUrl)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal mengunggah file ke Supabase Storage."
      setUploadError(
        `${msg} (Pastikan bucket '${bucket}' sudah dibuat dan berstatus public di Supabase Storage).`
      )
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isUploading) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled && !isUploading) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClear = () => {
    onChange("")
    setUploadError(null)
  }

  const effectiveError = error || uploadError

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="gap-0 text-sm font-medium">
          {label}
          {required ? (
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          ) : null}
        </Label>

        <button
          type="button"
          disabled={disabled || isUploading}
          onClick={() => setMode(mode === "upload" ? "url" : "upload")}
          className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-signal"
        >
          {mode === "upload" ? (
            <>
              <LinkIcon className="size-3" /> Masukkan URL manual
            </>
          ) : (
            <>
              <UploadCloud className="size-3" /> Unggah file
            </>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card p-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Preview gambar"
                className="h-full w-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='1.5'><rect width='18' height='18' x='3' y='3' rx='2'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>"
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                <CheckCircle2 className="size-3.5" /> Gambar aktif
              </p>
              <p className="w-64 truncate font-mono text-[11px] text-muted-foreground">
                {value}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="h-8 gap-1 text-xs"
              >
                <UploadCloud className="size-3.5" /> Ganti
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled || isUploading}
                onClick={handleClear}
                className="size-8 text-muted-foreground hover:text-destructive"
                title="Hapus gambar"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : mode === "url" ? (
        <div className="space-y-1">
          <Input
            id={`image-url-${autoId}`}
            placeholder="https://... atau /images/project.svg"
            value={value}
            disabled={disabled || isUploading}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
          />
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (!disabled && !isUploading) {
              fileInputRef.current?.click()
            }
          }}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-all",
            isDragging
              ? "border-signal bg-signal/10"
              : "border-border/80 bg-muted/20 hover:border-signal/50 hover:bg-muted/40",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="size-7 animate-spin text-signal" />
              <p className="text-xs font-medium text-foreground">
                Mengunggah ke Supabase Storage...
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                Bucket: {bucket}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-signal/10 text-signal">
                <UploadCloud className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">
                  <span className="text-signal hover:underline">
                    Pilih file gambar
                  </span>{" "}
                  atau seret ke sini
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  JPG, PNG, WebP, SVG (Maks. 5 MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {effectiveError ? (
        <p role="alert" className="text-[13px] text-destructive">
          {effectiveError}
        </p>
      ) : hint ? (
        <p className="text-[13px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
