import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-[var(--color-muted)] px-4 py-12">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[var(--color-primary)]">404</h1>
            <div className="text-6xl mb-4">🍽️</div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Página no encontrada</h2>
          <p className="text-[var(--color-muted-foreground)] text-lg mb-8 leading-relaxed">
            Lo sentimos, no pudimos encontrar la página que buscas. ¿Qué tal si mejor buscas un buen restaurante?
          </p>
          <Link href="/">
            <Button size="lg" className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white">
              <Home className="w-5 h-5 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
