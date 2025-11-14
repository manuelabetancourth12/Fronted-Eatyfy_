import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RestaurantDashboard } from "@/components/restaurant-dashboard"

export default function RestaurantDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RestaurantDashboard />
      <Footer />
    </div>
  )
}