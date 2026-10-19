import { useState, useRef } from "react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ArrowUpRight, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { fadeUp } from "../../helper/fadeUp"

const CvCard = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== "application/pdf") {
      toast.error("Hanya file PDF yang diterima.")
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/v1/cv", { method: "PUT", body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message ?? "Upload gagal")
      toast.success("CV berhasil diperbarui!")
    } catch (err: any) {
      toast.error(err?.message ?? "Gagal mengunggah CV.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" custom={9}>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-[15px]">
              <FileText className="size-4 text-signal" />
              Curriculum Vitae
            </CardTitle>
            <CardDescription>
              Ganti file CV yang bisa diunduh dari halaman publik.
            </CardDescription>
          </div>
          <a href="/api/v1/cv" download="Salman_Adhim_CV.pdf">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowUpRight className="size-3.5" />
              Lihat CV
            </Button>
          </a>
        </CardHeader>
        <CardContent>
          <div
            onClick={() => inputRef.current?.click()}
            className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-8 transition-colors hover:border-signal/60 hover:bg-signal/5"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-signal/15">
              <Upload className="size-5 text-muted-foreground transition-colors group-hover:text-signal" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {uploading ? "Mengunggah…" : "Klik untuk ganti CV"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                PDF · maks. 5 MB · akan menggantikan file lama
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CvCard
