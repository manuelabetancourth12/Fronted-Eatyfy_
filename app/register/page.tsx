import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-[var(--color-muted)]">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  )
}
