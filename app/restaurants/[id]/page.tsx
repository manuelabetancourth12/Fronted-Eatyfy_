import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RestaurantDetailPage } from "@/components/restaurant-detail-page"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <RestaurantDetailPage restaurantId={id} />
      <Footer />
    </div>
  )
}
