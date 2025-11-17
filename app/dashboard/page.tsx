import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UserDashboard } from "@/components/user-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <UserDashboard />
      <Footer />
    </div>
  )
}