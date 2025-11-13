import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RestaurantDetailPage } from "@/components/restaurant-detail-page"

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RestaurantDetailPage restaurantId={params.id} />
      <Footer />
    </div>
  )
}
