import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RegisterRestaurantForm } from "@/components/register-restaurant-form"

export default function RegisterRestaurantPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-12 px-4">
        <RegisterRestaurantForm />
      </main>
      <Footer />
    </div>
  )
}