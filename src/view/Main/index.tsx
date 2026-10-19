import { About } from "@/components/About"
import { Awards } from "@/components/Awards"
import { ChatbotSection } from "@/components/ChatbotSection"
import { Contact } from "@/components/Contact"
import { Experience } from "@/components/Experience"
import { Hero } from "@/components/Hero"
import { Projects } from "@/components/Projects"
import { Skills } from "@/components/Skills"

export const MainView = () => {
  return (
    <main id="main" className="space-y-24 pt-15 pb-32 lg:pt-32">
      <Hero />
      <About />
      <Projects />
      <div className="space-y-24 bg-card/40 py-14">
        <Experience />
        <Awards />
      </div>
      <Skills />
      <ChatbotSection />
      <Contact />
    </main>
  )
}
