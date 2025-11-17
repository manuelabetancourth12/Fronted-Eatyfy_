"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { fetchRestaurantsByCity } from "@/lib/api-client"
import { Search, MapPin, Phone, Globe, Clock, Users, Building2, Loader2 } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  cuisine: string
  phone?: string
  website?: string
  priceRange: string
  lat: number
  lon: number
}

export function AdminDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadAllRestaurants()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRestaurants(restaurants)
    } else {
      const filtered = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredRestaurants(filtered)
    }
  }, [searchTerm, restaurants])

  const loadAllRestaurants = async () => {
    setLoading(true)
    try {
      // Get all restaurants without filters
      const data = await fetchRestaurantsByCity("", undefined, "")
      setRestaurants(data)
      setFilteredRestaurants(data)
    } catch (error) {
      console.error("Error loading restaurants:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando todos los restaurantes...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl md:text-4xl font-bold">Panel Administrativo</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Vista completa de todos los restaurantes registrados en EatyFy
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{restaurants.length}</p>
                  <p className="text-sm text-gray-600">Total Restaurantes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(restaurants.map(r => r.city)).size}
                  </p>
                  <p className="text-sm text-gray-600">Ciudades Cubiertas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <MapPin className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(restaurants.map(r => r.cuisine)).size}
                  </p>
                  <p className="text-sm text-gray-600">Tipos de Cocina</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Search className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {restaurants.filter(r => r.website).length}
                  </p>
                  <p className="text-sm text-gray-600">Con Sitio Web</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Buscar restaurantes por nombre, dirección o tipo de cocina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12"
                />
              </div>
              <Button onClick={loadAllRestaurants} variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{restaurant.name}</CardTitle>
                    <Badge variant="secondary" className="mb-2">
                      {restaurant.cuisine}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {restaurant.priceRange}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{restaurant.address}</span>
                  </div>

                  {restaurant.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{restaurant.phone}</span>
                    </div>
                  )}

                  {restaurant.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline truncate"
                      >
                        {restaurant.website}
                      </a>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <Button
                      onClick={() => router.push(`/restaurants/${restaurant.id}`)}
                      className="w-full bg-pink-500 hover:bg-pink-600"
                    >
                      Ver Detalles Completos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron restaurantes</h3>
              <p className="text-gray-600">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Aún no hay restaurantes registrados"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}