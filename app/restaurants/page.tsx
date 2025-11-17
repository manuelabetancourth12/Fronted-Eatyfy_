import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RestaurantsPage } from "@/components/restaurants-page"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={
        <main className="flex-1 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-600">Cargando restaurantes...</span>
            </div>
          </div>
        </main>
      }>
        <RestaurantsPage />
      </Suspense>
      <Footer />
    </div>
  )
}
