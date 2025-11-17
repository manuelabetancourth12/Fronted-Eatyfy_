"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { User, ChefHat, ArrowRight } from "lucide-react"

export function RegisterTypeSelection() {
  const [selectedType, setSelectedType] = useState<"client" | "restaurant" | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selectedType === "client") {
      router.push("/register/client")
    } else if (selectedType === "restaurant") {
      router.push("/register/restaurant")
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Únete a EatyFy</h1>
        <p className="text-lg text-gray-600">¿Cómo quieres usar nuestra plataforma?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Cliente Option */}
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedType === "client"
              ? "ring-2 ring-pink-500 bg-pink-50"
              : "hover:border-pink-200"
          }`}
          onClick={() => setSelectedType("client")}
        >
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Soy Cliente</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Descubre restaurantes increíbles, encuentra opciones que se ajusten a tu presupuesto
              y disfruta de las mejores recomendaciones personalizadas.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>✅ Buscar restaurantes por ciudad y presupuesto</li>
              <li>✅ Ver menús y precios detallados</li>
              <li>✅ Recomendaciones personalizadas</li>
              <li>✅ Calificar y reseñar restaurantes</li>
            </ul>
          </CardContent>
        </Card>

        {/* Restaurante Option */}
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedType === "restaurant"
              ? "ring-2 ring-pink-500 bg-pink-50"
              : "hover:border-pink-200"
          }`}
          onClick={() => setSelectedType("restaurant")}
        >
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl text-gray-900">Soy Restaurante</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Gestiona tu restaurante, atrae nuevos clientes y haz crecer tu negocio con
              nuestra plataforma de gestión completa.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>✅ Gestionar información de tu restaurante</li>
              <li>✅ Crear y editar menú con precios</li>
              <li>✅ Recibir reseñas de clientes</li>
              <li>✅ Gestionar promociones y ofertas</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={handleContinue}
          disabled={!selectedType}
          className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white text-lg"
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {!selectedType && (
          <p className="text-sm text-gray-500 mt-2">
            Selecciona una opción para continuar
          </p>
        )}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-pink-600 hover:text-pink-700 font-medium">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}