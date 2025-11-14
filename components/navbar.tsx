"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Utensils } from "lucide-react"
import { fetchUserProfile } from "@/lib/api-client"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role?: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("eatyfy_token")
    if (token) {
      fetchUserProfile().then(setUser).catch(() => {
        // If token invalid, clear it
        localStorage.removeItem("eatyfy_token")
        localStorage.removeItem("eatyfy_user")
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("eatyfy_token")
    localStorage.removeItem("eatyfy_user")
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="bg-white border-b border-pink-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Utensils className="w-7 h-7 text-gray-900" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-gray-900">Eatyfy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-gray-700 hover:text-gray-900 transition-colors font-medium ${
                pathname === "/" ? "text-gray-900 font-semibold" : ""
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/restaurants"
              className={`text-gray-700 hover:text-gray-900 transition-colors font-medium ${
                pathname === "/restaurants" ? "text-gray-900 font-semibold" : ""
              }`}
            >
              Restaurantes
            </Link>
            {user && (
              <>
                <Link
                  href="/profile"
                  className={`text-gray-700 hover:text-gray-900 transition-colors font-medium ${
                    pathname === "/profile" ? "text-gray-900 font-semibold" : ""
                  }`}
                >
                  Mi perfil
                </Link>
                {user.role === "RESTAURANT" ? (
                  <Link
                    href="/restaurant-dashboard"
                    className={`text-gray-700 hover:text-gray-900 transition-colors font-medium ${
                      pathname === "/restaurant-dashboard" ? "text-gray-900 font-semibold" : ""
                    }`}
                  >
                    Panel Restaurante
                  </Link>
                ) : (
                  <Link
                    href="/register-restaurant"
                    className={`text-gray-700 hover:text-gray-900 transition-colors font-medium ${
                      pathname === "/register-restaurant" ? "text-gray-900 font-semibold" : ""
                    }`}
                  >
                    Registrar Restaurante
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" className="gap-2 text-gray-700 hover:text-gray-900">
                    <User className="w-4 h-4" />
                    {user.name}
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="border-gray-300 bg-transparent">
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="border-gray-300 bg-transparent">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-pink-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg hover:bg-pink-50 text-gray-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/restaurants"
              className="block px-3 py-2 rounded-lg hover:bg-pink-50 text-gray-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Restaurantes
            </Link>
            {user && (
              <>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-lg hover:bg-pink-50 text-gray-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Mi perfil
                </Link>
                {user.role === "RESTAURANT" ? (
                  <Link
                    href="/restaurant-dashboard"
                    className="block px-3 py-2 rounded-lg hover:bg-pink-50 text-gray-700 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Panel Restaurante
                  </Link>
                ) : (
                  <Link
                    href="/register-restaurant"
                    className="block px-3 py-2 rounded-lg hover:bg-pink-50 text-gray-700 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Registrar Restaurante
                  </Link>
                )}
              </>
            )}
            <div className="pt-3 border-t border-pink-200 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600">{user.name}</div>
                  <Button onClick={handleLogout} className="w-full bg-transparent" variant="outline">
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-transparent" variant="outline">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link href="/register" className="block" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
