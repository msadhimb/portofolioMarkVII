import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { LanguageProvider } from "@/components/LanguageProvider"
import { QueryProvider } from "@/components/QueryProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MobileMotionProvider } from "@/components/MobileMotionProvider"
import AmbientBackdrop from "@/components/AmbientBackdrop"
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
    default: "Muhamad Salman Adhim Baqy — Web Developer",
    template: "%s · salman.adhim",
  },
  description:
    "Portofolio Muhamad Salman Adhim Baqy — web developer dengan empat tahun pengalaman membangun produk Next.js: antarmuka, API, database, auth, hingga deploy.",
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
    siteName: "salman.adhim",
    title: "Muhamad Salman Adhim Baqy — Web Developer",
    description:
      "Antarmuka yang tenang, sistem yang rapi. Proyek, pengalaman, dan cara kerja.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhamad Salman Adhim Baqy — Web Developer",
    description: "Next.js · TypeScript · Supabase · Enterprise & produk independen.",
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
        <AmbientBackdrop />
        <div className="relative z-10">
          <QueryProvider>
            <ThemeProvider>
              <TooltipProvider>
                <MobileMotionProvider>
                  <LanguageProvider>{children}</LanguageProvider>
                </MobileMotionProvider>
              </TooltipProvider>
            </ThemeProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  )
}

export default RootLayout
