import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MenuManagement } from "@/components/menu-management"

export default function MenuPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <MenuManagement />
      <Footer />
    </div>
  )
}