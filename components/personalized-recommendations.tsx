"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchPersonalizedRecommendations } from "@/lib/api-client"
import { Heart, Star, MapPin, DollarSign } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  cuisine: string
  priceRange: string
  lat: number
  lon: number
}

interface PersonalizedRecommendationsProps {
  title?: string
  limit?: number
  showPreferences?: boolean
}

export function PersonalizedRecommendations({
  title = "Recomendaciones Personalizadas",
  limit = 6,
  showPreferences = false
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [userPreferences, setUserPreferences] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    loadRecommendations()
  }, [])

  const loadRecommendations = async () => {
    setLoading(true)
    try {
      const data = await fetchPersonalizedRecommendations()
      setRecommendations(data.slice(0, limit))

      // If showing preferences, we could fetch user profile here
      // For now, we'll show based on recommendations
    } catch (error) {
      console.error("Error loading recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mr-3" />
            <span>Cargando recomendaciones...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No hay recomendaciones disponibles</p>
            <p className="text-sm text-gray-500">
              Completa tu perfil con preferencias gastronómicas para mejores recomendaciones
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          {title}
        </CardTitle>
        {showPreferences && (
          <p className="text-sm text-gray-600">
            Basado en tus preferencias: cocina italiana, presupuesto moderado
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((restaurant) => (
            <div
              key={restaurant.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/restaurants/${restaurant.id}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{restaurant.name}</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs">4.5</span>
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="line-clamp-1">{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span>{restaurant.priceRange}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                  {restaurant.cuisine}
                </span>
                <Button size="sm" variant="outline" className="text-xs">
                  Ver más
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/restaurants")}
            className="border-pink-300 text-pink-600 hover:bg-pink-50"
          >
            Ver más recomendaciones
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}