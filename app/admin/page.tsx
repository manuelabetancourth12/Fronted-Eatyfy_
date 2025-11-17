import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AdminDashboard />
      <Footer />
    </div>
  )
}