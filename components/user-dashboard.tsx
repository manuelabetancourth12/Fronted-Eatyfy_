"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchUserProfile, fetchPersonalizedRecommendations } from "@/lib/api-client"
import { Search, Heart, Star, User, Loader2 } from "lucide-react"

export function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setLoading(true)
    try {
      const userData = await fetchUserProfile()
      setUser(userData)

      // Load personalized recommendations
      const recs = await fetchPersonalizedRecommendations()
      setRecommendations(recs.slice(0, 3))
    } catch (error) {
      console.error("Error loading user data:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu panel...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acceso requerido</h2>
            <p className="text-gray-600 mb-6">Debes iniciar sesión para acceder a tu panel</p>
            <Button onClick={() => router.push("/login")}>
              Iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">¡Hola, {user.name}!</h1>
          <p className="text-gray-600 text-lg">
            Descubre nuevos restaurantes y disfruta de tus recomendaciones personalizadas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>¿Qué quieres hacer hoy?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => router.push("/restaurants")}
                    className="h-20 flex flex-col items-center gap-2 bg-pink-500 hover:bg-pink-600"
                  >
                    <Search className="w-6 h-6" />
                    <span>Buscar Restaurantes</span>
                  </Button>

                  <Button
                    onClick={() => router.push("/profile")}
                    variant="outline"
                    className="h-20 flex flex-col items-center gap-2 border-gray-300"
                  >
                    <User className="w-6 h-6" />
                    <span>Mi Perfil</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Personalized Recommendations */}
            {recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Recomendaciones para ti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map((restaurant: any) => (
                      <div
                        key={restaurant.id}
                        className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/restaurants/${restaurant.id}`)}
                      >
                        <h3 className="font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
                        <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                        <p className="text-sm font-medium text-pink-600">
                          ${restaurant.priceRange}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/restaurants")}
                    >
                      Ver más recomendaciones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - User Stats */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tu actividad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
                  <p className="text-sm text-gray-600">Restaurantes visitados</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">0</div>
                  <p className="text-sm text-gray-600">Reseñas escritas</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
                  <p className="text-sm text-gray-600">Favoritos guardados</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>¿Quieres ser restaurante?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Registra tu restaurante y llega a más clientes
                </p>
                <Button
                  onClick={() => router.push("/register/restaurant")}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  Registrar Restaurante
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}