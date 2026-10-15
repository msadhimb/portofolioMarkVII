import { About } from "@/components/About"
import { ChatbotSection } from "@/components/ChatbotSection"
import { Contact } from "@/components/Contact"
import { Experience } from "@/components/Experience"
import { Hero } from "@/components/Hero"
import { Marquee } from "@/components/Marquee"
import { Projects } from "@/components/Projects"
import { Skills } from "@/components/Skills"

const marqueeItems = [
  "Next.js",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "React Query",
  "Zustand",
  "Tailwind CSS",
  "Ollama AI",
  "Available for work",
]

export const MainView = () => {
  return (
    <main id="main">
      <Hero />
      {/* <Marquee items={marqueeItems} /> */}
      <About />
      <Projects />
      <Experience />
      <Skills />
      <ChatbotSection />
      <Contact />
    </main>
  )
}
