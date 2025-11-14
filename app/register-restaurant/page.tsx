import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RegisterRestaurantForm } from "@/components/register-restaurant-form"

export default function RegisterRestaurantPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-[var(--color-muted)]">
        <RegisterRestaurantForm />
      </main>
      <Footer />
    </div>
  )
}