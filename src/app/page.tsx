import { Footer } from "@/components/Footer"
import { Navbar } from "@/components/Navbar"
import VisitorTracker from "@/components/VisitorTracker"
import { MainView } from "@/view/Main"

const Page = () => {
  return (
    <>
      <Navbar />
      <MainView />
      <Footer />
      <VisitorTracker />
    </>
  )
}

export default Page
