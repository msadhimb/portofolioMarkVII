import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { LanguageProvider } from "@/components/LanguageProvider"
import { QueryProvider } from "@/components/QueryProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MobileMotionProvider } from "@/components/MobileMotionProvider"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const display = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://salmanbaqy.dev"),
  title: {
    default: "Muhamad Salman Adhim Baqy — Web Developer / Frontend Engineer",
    template: "%s · Muhamad Salman Adhim Baqy",
  },
  description:
    "Portofolio Muhamad Salman Adhim Baqy, Web Developer dengan ±4 tahun pengalaman JavaScript. Membangun aplikasi Next.js yang terstruktur dan cepat untuk BUMN, institusi, dan produk independen — dari UI, API, database, auth, hingga deployment.",
  keywords: [
    "Web Developer",
    "Frontend Engineer",
    "Next.js",
    "React",
    "TypeScript",
    "Supabase",
    "Portofolio",
    "Indonesia",
  ],
  authors: [{ name: "Muhamad Salman Adhim Baqy" }],
  creator: "Muhamad Salman Adhim Baqy",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "salman.dev",
    title: "Muhamad Salman Adhim Baqy — Web Developer / Frontend Engineer",
    description:
      "Saya membangun aplikasi web yang terstruktur, cepat, dan memiliki pengalaman pengguna yang matang.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhamad Salman Adhim Baqy — Web Developer / Frontend Engineer",
    description:
      "Next.js · TypeScript · Supabase · Enterprise & produk independen.",
  },
  robots: { index: true, follow: true },
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geist.variable,
        geistMono.variable,
        display.variable
      )}
    >
      <body className="font-sans">
        <QueryProvider>
          <ThemeProvider>
            <TooltipProvider>
              <MobileMotionProvider>
                <LanguageProvider>{children}</LanguageProvider>
              </MobileMotionProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

export default RootLayout
