"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"
import { fetchRestaurantsByCity } from "@/lib/api-client"
import { Loader2, MapPin, DollarSign } from "lucide-react"
import Link from "next/link"

interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  category?: string
}

interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  lat: number
  lon: number
  cuisine?: string
  priceRange?: string
  menuItems?: MenuItem[]
}

export function RestaurantsPage() {
  const searchParams = useSearchParams()
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "Bogotá, Medellin, Cali, Barranquilla...",
  )
  const [budget, setBudget] = useState(searchParams.get("budget") || "60000")
  const [cuisineType, setCuisineType] = useState("")
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load restaurants on initial mount
    loadRestaurants()
  }, [])

  useEffect(() => {
    // Load restaurants when city changes (but not on initial load)
    if (selectedCity !== "Bogotá, Medellin, Cali, Barranquilla...") {
      loadRestaurants()
    }
  }, [selectedCity])

  const loadRestaurants = async () => {
    if (loading) return
    setLoading(true)
    try {
      let cityParam = undefined
      if (selectedCity !== "Bogotá, Medellin, Cali, Barranquilla...") {
        cityParam = selectedCity.split(",")[0].trim()
      }

      const data = await fetchRestaurantsByCity(
        cityParam,
        budget ? Number.parseInt(budget) : undefined,
        cuisineType || undefined
      )
      setRestaurants(data)
    } catch (error) {
      console.error("[v0] Error loading restaurants:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadRestaurants()
  }

  const handleClear = () => {
    setSelectedCity("Bogotá, Medellin, Cali, Barranquilla...")
    setBudget("60000")
    setCuisineType("")
  }


  return (
    <main className="flex-1 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Explora restaurantes</h1>
          <p className="text-gray-600">Elige tu ciudad, define tu presupuesto y actualiza resultados.</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="city-filter" className="text-gray-700 font-medium">
                  Ciudad
                </Label>
                <Input
                  id="city-filter"
                  type="text"
                  placeholder="Bogotá, Medellin, Cali, Barranquilla..."
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-filter" className="text-gray-700 font-medium">
                  Presupuesto máximo (COP)
                </Label>
                <Input
                  id="budget-filter"
                  type="text"
                  placeholder="$ 60.000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisine-filter" className="text-gray-700 font-medium">
                  Tipo de comida (opcional)
                </Label>
                <Input
                  id="cuisine-filter"
                  type="text"
                  placeholder="Colombiana, Italiana, Rápida, Sushi..."
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Actualizar resultados
              </Button>
              <Button type="button" variant="outline" onClick={handleClear} className="border-gray-300 bg-transparent">
                Limpiar
              </Button>
            </div>
          </form>
        </div>

        {/* Restaurant List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? "Buscando..." : `${restaurants.length} restaurantes`}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
          ) : restaurants.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">No se encontraron restaurantes. Intenta con otros filtros.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {restaurant.address} • {restaurant.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">Comida: {restaurant.cuisine || "Colombiana"}</span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {restaurant.priceRange || "$$"}
                      </span>
                    </div>

                    {/* Menu Items */}
                    {restaurant.menuItems && restaurant.menuItems.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Platos disponibles:</p>
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                          {restaurant.menuItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-xs bg-gray-50 px-2 py-1 rounded">
                              <span className="truncate">{item.name}</span>
                              <span className="font-medium text-pink-600">${item.price?.toLocaleString()}</span>
                            </div>
                          ))}
                          {restaurant.menuItems.length > 3 && (
                            <p className="text-xs text-gray-400">+{restaurant.menuItems.length - 3} más...</p>
                          )}
                        </div>
                      </div>
                    )}

                    <Link href={`/restaurants/${restaurant.id}`}>
                      <Button variant="outline" className="w-full border-gray-300 bg-transparent">
                        Ver detalles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
