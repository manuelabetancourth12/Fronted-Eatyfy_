"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapWrapper } from "./map-wrapper"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { fetchRestaurantDetails, fetchPromotions } from "@/lib/api-client"
import { MapPin, Phone, Globe, Clock, ArrowLeft, Utensils } from "lucide-react"
import Link from "next/link"

interface RestaurantDetail {
  id: string
  name: string
  address: string
  lat: number
  lon: number
  cuisine?: string
  phone?: string
  website?: string
  opening_hours?: string
}

interface RestaurantDetailPageProps {
  restaurantId: string
}

export function RestaurantDetailPage({ restaurantId }: RestaurantDetailPageProps) {
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [promotions, setPromotions] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    loadRestaurantDetail()
    loadPromotions()
  }, [restaurantId])

  const loadRestaurantDetail = async () => {
    setLoading(true)
    try {
      const data = await fetchRestaurantDetails(restaurantId)
      setRestaurant(data)
    } catch (error) {
      console.error("[v0] Error loading restaurant details:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadPromotions = async () => {
    try {
      const data = await fetchPromotions()
      setPromotions(data.slice(0, 2)) // Show only 2 promotions
    } catch (error) {
      console.error("[v0] Error loading promotions:", error)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 bg-[var(--color-muted)] flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-muted-foreground)]">Cargando detalles...</p>
        </div>
      </main>
    )
  }

  if (!restaurant) {
    return (
      <main className="flex-1 bg-[var(--color-muted)] flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-xl text-[var(--color-foreground)] mb-4">Restaurante no encontrado</p>
          <Link href="/restaurants">
            <Button>Volver a restaurantes</Button>
          </Link>
        </div>
      </main>
    )
  }

  const mapMarkers = [
    {
      id: restaurant.id,
      name: restaurant.name,
      position: [restaurant.lat, restaurant.lon] as [number, number],
      address: restaurant.address,
    },
  ]

  return (
    <main className="flex-1 bg-[var(--color-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        {/* Restaurant Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
                <MapPin className="w-5 h-5" />
                <span>{restaurant.address}</span>
              </div>
            </div>
            {restaurant.cuisine && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 rounded-lg">
                <Utensils className="w-5 h-5 text-[var(--color-primary)]" />
                <span className="font-medium">{restaurant.cuisine}</span>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {restaurant.phone && (
              <div className="flex items-center gap-3 p-3 bg-[var(--color-muted)] rounded-lg">
                <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Teléfono</p>
                  <p className="font-medium">{restaurant.phone}</p>
                </div>
              </div>
            )}

            {restaurant.website && (
              <div className="flex items-center gap-3 p-3 bg-[var(--color-muted)] rounded-lg">
                <Globe className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Sitio web</p>
                  <a
                    href={restaurant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Visitar
                  </a>
                </div>
              </div>
            )}

            {restaurant.opening_hours && (
              <div className="flex items-center gap-3 p-3 bg-[var(--color-muted)] rounded-lg">
                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                <div>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Horario</p>
                  <p className="font-medium text-sm">{restaurant.opening_hours}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <MapWrapper center={[restaurant.lat, restaurant.lon]} markers={mapMarkers} zoom={15} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Promotions */}
            <Card>
              <CardHeader>
                <CardTitle>Promociones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {promotions.length > 0 ? (
                  promotions.map((promo) => (
                    <div
                      key={promo.id}
                      className="p-4 bg-[var(--color-accent)]/10 rounded-lg border border-[var(--color-accent)]/20"
                    >
                      <h4 className="font-semibold text-[var(--color-accent)] mb-1">{promo.title}</h4>
                      <p className="text-sm text-[var(--color-foreground)]">{promo.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    No hay promociones disponibles en este momento
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Similar Restaurants */}
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones similares</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Próximamente: restaurantes similares en esta zona
                </p>
                {/* TODO: Implement similar restaurants recommendations */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
