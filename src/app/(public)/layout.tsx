import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import React from "react"

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="lg:pt-20 lg:pb-10">{children}</main>
      <Footer />
    </>
  )
}

export default PublicLayout
