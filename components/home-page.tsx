"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { fetchRestaurantsByCity } from "@/lib/api-client"

export function HomePage() {
  const [selectedCity, setSelectedCity] = useState("Bogotá, Medellin, Cali, Barranquilla...")
  const [budget, setBudget] = useState("50000")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [restaurants, setRestaurants] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("eatyfy_token")
    setIsLoggedIn(!!token)

    // Fetch some restaurants for recommendations
    fetchRestaurantsByCity().then(data => {
      setRestaurants(data.slice(0, 3)) // Show first 3
    }).catch(() => {
      // Fallback to mock if no data
      setRestaurants([
        { id: 1, name: "Restaurante 1", averagePricePerPerson: 30000, address: "Bogotá", cuisineType: "Italiana" },
        { id: 2, name: "Restaurante 2", averagePricePerPerson: 50000, address: "Medellín", cuisineType: "Mexicana" },
        { id: 3, name: "Restaurante 3", averagePricePerPerson: 25000, address: "Cali", cuisineType: "Colombiana" },
      ])
    })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const city = selectedCity.split(",")[0].trim()
    const params = new URLSearchParams()
    params.set("city", city)
    if (budget) {
      params.set("budget", budget)
    }
    router.push(`/restaurants?${params.toString()}`)
  }

  const handleGetStarted = () => {
    router.push("/restaurants")
  }

  return (
    <main className="flex-1 bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-100 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-pink-200 text-pink-800 inline-block px-4 py-2 rounded-full text-sm font-medium mb-6">
            Nuevo en tu ciudad
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 text-balance max-w-3xl">
            Come rico sin salirte del presupuesto
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">
            Encuentra restaurantes que se ajustan a tu bolsillo en tu ciudad, de forma rápida, clara y sin
            complicaciones.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8"
          >
            Empezar ahora
          </Button>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Búsqueda rápida</h2>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-gray-700 font-medium">
                    Presupuesto máximo (COP)
                  </Label>
                  <Input
                    id="budget"
                    type="text"
                    placeholder="$ 50.000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700 font-medium">
                    Ciudad
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Bogotá, Medellin, Cali, Barranquilla..."
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" size="lg" className="bg-pink-500 hover:bg-pink-600 text-white px-8">
                  Buscar restaurantes
                </Button>
                <Button type="button" size="lg" variant="outline" className="border-gray-300 bg-transparent">
                  Limpiar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-12 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Recomendados para ti</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants.map((restaurant: any) => (
              <Card key={restaurant.id} className="bg-pink-50 border-pink-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    ${restaurant.averagePricePerPerson || "N/A"} • {restaurant.address}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">{restaurant.cuisineType || "Sin descripción"}</p>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 bg-transparent"
                    onClick={() => router.push(`/restaurants/${restaurant.id}`)}
                  >
                    Ver detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
