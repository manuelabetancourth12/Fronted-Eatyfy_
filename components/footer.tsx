import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold">Eatyfy</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Come rico sin salirte del presupuesto. Descubre los mejores restaurantes de Colombia.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-white/80 hover:text-white transition-colors text-sm">
                  Restaurantes
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-white/80 hover:text-white transition-colors text-sm">
                  Mi perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              ¿Tienes preguntas? Contáctanos en:{" "}
              <a href="mailto:hola@eatyfy.com" className="text-[var(--color-accent)] hover:underline">
                hola@eatyfy.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/70 text-sm">
          <p>Eatyfy © 2025 – Come rico sin salirte del presupuesto</p>
        </div>
      </div>
    </footer>
  )
}
