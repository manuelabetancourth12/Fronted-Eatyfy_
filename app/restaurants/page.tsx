import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RestaurantsPage } from "@/components/restaurants-page"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RestaurantsPage />
      <Footer />
    </div>
  )
}
