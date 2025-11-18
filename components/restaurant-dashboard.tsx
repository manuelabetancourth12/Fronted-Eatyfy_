"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { fetchUserProfile, updateRestaurant, fetchReviewsByRestaurant } from "@/lib/api-client"
import { Settings, Utensils, MessageSquare, Save, Loader2, Star, User } from "lucide-react"

export function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisineType: "",
    phone: "",
    website: "",
    openingHours: "",
    averagePricePerPerson: ""
  })
  const router = useRouter()

  useEffect(() => {
    loadRestaurantData()
  }, [])

  const loadRestaurantData = async () => {
    setLoading(true)
    try {
      const userData = await fetchUserProfile()

      // Find restaurant owned by this user
      // For now, assume user has one restaurant - in real app, would need to select or list
      if (userData.role !== "RESTAURANT") {
        router.push("/register-restaurant")
        return
      }

      // This would need to be implemented: fetch user's restaurants
      // For now, we'll show a placeholder
      setRestaurant({
        id: 1,
        name: "Mi Restaurante",
        address: "Calle 123, Bogotá",
        cuisineType: "Italiana",
        phone: "+57 300 123 4567",
        website: "https://mirestaurante.com",
        openingHours: "Lun-Dom: 12:00-22:00",
        averagePricePerPerson: 35000
      })

      setFormData({
        name: "Mi Restaurante",
        address: "Calle 123, Bogotá",
        cuisineType: "Italiana",
        phone: "+57 300 123 4567",
        website: "https://mirestaurante.com",
        openingHours: "Lun-Dom: 12:00-22:00",
        averagePricePerPerson: "35000"
      })

      // Load reviews for this restaurant
      const reviewsData = await fetchReviewsByRestaurant(1)
      setReviews(reviewsData)

    } catch (error) {
      console.error("Error loading restaurant data:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRestaurant = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updatedData = {
        ...formData,
        averagePricePerPerson: parseFloat(formData.averagePricePerPerson) || 0
      }

      await updateRestaurant(restaurant.id, updatedData)
      setRestaurant({ ...restaurant, ...updatedData })
      alert("Información actualizada exitosamente")
    } catch (error) {
      console.error("Error updating restaurant:", error)
      alert("Error al actualizar la información")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando panel de restaurante...</p>
        </div>
      </main>
    )
  }

  if (!restaurant) {
    return (
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No tienes restaurante registrado</h2>
            <p className="text-gray-600 mb-6">Registra tu restaurante para acceder al panel de administración</p>
            <Button onClick={() => router.push("/register-restaurant")}>
              Registrar Restaurante
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de Restaurante</h1>
          <p className="text-gray-600 text-lg">
            Gestiona tu restaurante, menú y reseñas
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "info"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Información
            </button>
            <button
              onClick={() => router.push(`/restaurant-dashboard/menu`)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-900"
            >
              <Utensils className="w-4 h-4 inline mr-2" />
              Menú
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "reviews"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Reseñas ({reviews.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "info" && (
              <Card>
                <CardHeader>
                  <CardTitle>Información del Restaurante</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveRestaurant} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Restaurante *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cuisineType">Tipo de Cocina *</Label>
                        <select
                          id="cuisineType"
                          name="cuisineType"
                          value={formData.cuisineType}
                          onChange={handleInputChange}
                          className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          required
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Italiana">Italiana</option>
                          <option value="Mexicana">Mexicana</option>
                          <option value="Japonesa">Japonesa</option>
                          <option value="China">China</option>
                          <option value="Colombiana">Colombiana</option>
                          <option value="Mediterránea">Mediterránea</option>
                          <option value="Americana">Americana</option>
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Dirección *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Sitio Web</Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="openingHours">Horarios de Atención</Label>
                        <Input
                          id="openingHours"
                          name="openingHours"
                          value={formData.openingHours}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="averagePricePerPerson">Precio Promedio por Persona (COP)</Label>
                        <Input
                          id="averagePricePerPerson"
                          name="averagePricePerPerson"
                          type="number"
                          value={formData.averagePricePerPerson}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === "menu" && (
              <Card>
                <CardHeader>
                  <CardTitle>Gestión del Menú</CardTitle>
                  <p className="text-sm text-gray-600">
                    Gestiona los platos de tu restaurante
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Utensils className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Administra tu menú completo desde aquí
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Añade, edita y elimina platos con precios y descripciones
                    </p>
                    <Button
                      onClick={() => router.push('/restaurant-dashboard/menu')}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      <Utensils className="w-4 h-4 mr-2" />
                      Gestionar Menú
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "reviews" && (
              <Card>
                <CardHeader>
                  <CardTitle>Reseñas de Clientes</CardTitle>
                  <p className="text-sm text-gray-600">
                    Gestiona las reseñas y responde a tus clientes
                  </p>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Aún no tienes reseñas</p>
                      <p className="text-sm text-gray-500">
                        Las reseñas aparecerán aquí cuando los clientes visiten tu restaurante
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-pink-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{review.user?.name || "Cliente"}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                            </div>
                          </div>

                          {review.comment && (
                            <p className="text-gray-700 mb-4">{review.comment}</p>
                          )}

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Responder
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Stats */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600 mb-1">
                    {reviews.length > 0
                      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                      : "0.0"
                    }
                  </div>
                  <p className="text-sm text-gray-600">Calificación promedio</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{reviews.length}</div>
                  <p className="text-sm text-gray-600">Total reseñas</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {restaurant.averagePricePerPerson?.toLocaleString() || "N/A"}
                  </div>
                  <p className="text-sm text-gray-600">Precio promedio</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}