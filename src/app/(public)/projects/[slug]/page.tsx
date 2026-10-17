import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import { projectSlugs } from "@/data/localized"
import { ProjectView } from "@/view/Project"

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = () => projectSlugs.map((slug) => ({ slug }))

export const metadata: Metadata = {
  title: "Case Study",
}

const CaseStudyPage = async ({ params }: CaseStudyPageProps) => {
  const { slug } = await params

  return (
    <>
      <ProjectView slug={slug} />
    </>
  )
}

export default CaseStudyPage
