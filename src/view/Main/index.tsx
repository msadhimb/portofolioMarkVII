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
    <main id="main">
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Awards />
      <Skills />
      <ChatbotSection />
      <Contact />
    </main>
  )
}
