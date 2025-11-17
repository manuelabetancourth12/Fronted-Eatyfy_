"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { fetchPersonalizedRecommendations } from "@/lib/api-client"
import { fetchUserProfile } from "@/lib/api-client"
import { fetchRestaurantsByCity } from "@/lib/api-client"

export function HomePage() {
  const [selectedCity, setSelectedCity] = useState("Bogotá, Medellin, Cali, Barranquilla...")
  const [budget, setBudget] = useState("50000")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [personalizedRestaurants, setPersonalizedRestaurants] = useState<any[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("eatyfy_token")
    setIsLoggedIn(!!token)

    if (token) {
      loadPersonalizedRecommendations()
    } else {
      // For non-logged-in users, show general recommendations
      fetchRestaurantsByCity().then(data => {
        setRestaurants(data.slice(0, 3)) // Show first 3
      }).catch((error) => {
        console.error("Error loading restaurants:", error)
        setRestaurants([])
      })
    }
  }, [])

  const loadPersonalizedRecommendations = async () => {
    setLoadingRecommendations(true)
    try {
      const recommendations = await fetchPersonalizedRecommendations(
        selectedCity.split(",")[0].trim(),
        budget ? Number.parseInt(budget) : undefined
      )
      setPersonalizedRestaurants(recommendations.slice(0, 3)) // Show top 3 personalized
    } catch (error) {
      console.error("Error loading personalized recommendations:", error)
      // Fallback to general recommendations
      setPersonalizedRestaurants([])
    } finally {
      setLoadingRecommendations(false)
    }
  }

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
          <h2 className="text-2xl font-bold mb-8 text-gray-900">
            {isLoggedIn ? "Recomendados para ti" : "Restaurantes destacados"}
          </h2>

          {isLoggedIn && loadingRecommendations ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-gray-600">Cargando recomendaciones personalizadas...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(isLoggedIn ? personalizedRestaurants : restaurants).map((restaurant: any) => (
                <Card key={restaurant.id} className="bg-pink-50 border-pink-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      ${restaurant.averagePricePerPerson || restaurant.priceRange || "N/A"} • {restaurant.address || restaurant.city}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">{restaurant.cuisine || restaurant.cuisineType || "Sin descripción"}</p>
                    {isLoggedIn && (
                      <div className="mb-3 p-2 bg-pink-100 rounded-lg">
                        <p className="text-xs text-pink-800 font-medium">🎯 Recomendación personalizada</p>
                      </div>
                    )}
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
          )}

          {isLoggedIn && personalizedRestaurants.length === 0 && !loadingRecommendations && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No se encontraron recomendaciones personalizadas.</p>
              <p className="text-sm text-gray-500">Actualiza tus preferencias en tu perfil para mejores recomendaciones.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
