import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RegisterTypeSelection } from "@/components/register-type-selection"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
        <RegisterTypeSelection />
      </main>
      <Footer />
    </div>
  )
}
