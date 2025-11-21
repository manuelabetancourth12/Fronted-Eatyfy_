import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HomePage } from "@/components/home-page"
import { Chatbot } from "@/components/chatbot"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HomePage />
      <Footer />
      <Chatbot />
    </div>
  )
}
