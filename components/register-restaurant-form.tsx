"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser, registerRestaurant } from "@/lib/api-client"

export function RegisterRestaurantForm() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    cuisineType: "",
    phone: "",
    website: "",
    openingHours: "",
    averagePricePerPerson: "",
    latitude: "",
    longitude: ""
  })
  const [menuItems, setMenuItems] = useState<Array<{
    name: string
    description: string
    price: string
    category: string
  }>>([{ name: "", description: "", price: "", category: "" }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setRestaurantData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleMenuItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...menuItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setMenuItems(updatedItems)
  }

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: "", description: "", price: "", category: "" }])
  }

  const removeMenuItem = (index: number) => {
    if (menuItems.length > 1) {
      setMenuItems(menuItems.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // First, register the user with RESTAURANT role
      const userResponse = await registerUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: "RESTAURANT"
      })

      // Save token to localStorage
      localStorage.setItem("eatyfy_token", userResponse.token)
      localStorage.setItem("eatyfy_user", JSON.stringify(userResponse.user))

      // Filter out empty menu items
      const validMenuItems = menuItems.filter(item =>
        item.name.trim() && item.price.trim()
      ).map(item => ({
        name: item.name.trim(),
        description: item.description.trim(),
        price: parseFloat(item.price) || 0,
        category: item.category.trim() || "Plato principal"
      }))

      console.log("Sending restaurant data:", {
        ...restaurantData,
        averagePricePerPerson: parseFloat(restaurantData.averagePricePerPerson) || 0,
        latitude: parseFloat(restaurantData.latitude) || null,
        longitude: parseFloat(restaurantData.longitude) || null,
        menuItems: validMenuItems
      })

      const restaurantRequestData = {
        ...restaurantData,
        averagePricePerPerson: parseFloat(restaurantData.averagePricePerPerson) || 0,
        latitude: parseFloat(restaurantData.latitude) || null,
        longitude: parseFloat(restaurantData.longitude) || null,
        menuItems: validMenuItems
      }

      console.log("About to register restaurant with data:", restaurantRequestData)
      const restaurantResponse = await registerRestaurant(restaurantRequestData)
      console.log("Restaurant registration response:", restaurantResponse)
      router.push("/restaurant-dashboard")
    } catch (err) {
      console.error("Restaurant registration error:", err)
      setError(`Error al registrar restaurante: ${err instanceof Error ? err.message : 'Intenta de nuevo.'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-900">Registrar Restaurante</CardTitle>
        <p className="text-center text-gray-600">Únete a EatyFy y llega a más clientes</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

          {/* User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información de la Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="user-name" className="text-gray-700 font-medium">
                  Tu Nombre Completo *
                </Label>
                <Input
                  id="user-name"
                  name="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={userData.name}
                  onChange={handleUserChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-email" className="text-gray-700 font-medium">
                  Correo Electrónico *
                </Label>
                <Input
                  id="user-email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={userData.email}
                  onChange={handleUserChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="user-password" className="text-gray-700 font-medium">
                  Contraseña *
                </Label>
                <Input
                  id="user-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={userData.password}
                  onChange={handleUserChange}
                  required
                  minLength={6}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información del Restaurante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="restaurant-name" className="text-gray-700 font-medium">
                  Nombre del Restaurante *
                </Label>
                <Input
                  id="restaurant-name"
                  name="name"
                  type="text"
                  placeholder="Mi Restaurante"
                  value={restaurantData.name}
                  onChange={handleRestaurantChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisineType" className="text-gray-700 font-medium">
                  Tipo de Cocina *
                </Label>
                <select
                  id="cuisineType"
                  name="cuisineType"
                  value={restaurantData.cuisineType}
                  onChange={handleRestaurantChange}
                  required
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Italiana">Italiana</option>
                  <option value="Mexicana">Mexicana</option>
                  <option value="Japonesa">Japonesa</option>
                  <option value="China">China</option>
                  <option value="Colombiana">Colombiana</option>
                  <option value="Mediterránea">Mediterránea</option>
                  <option value="Americana">Americana</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">
                  Dirección *
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Calle 123 #45-67, Ciudad"
                  value={restaurantData.address}
                  onChange={handleRestaurantChange}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  value={restaurantData.phone}
                  onChange={handleRestaurantChange}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-gray-700 font-medium">
                  Sitio Web
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://mirestaurante.com"
                  value={restaurantData.website}
                  onChange={handleRestaurantChange}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="averagePricePerPerson" className="text-gray-700 font-medium">
                  Precio Promedio por Persona (COP)
                </Label>
                <Input
                  id="averagePricePerPerson"
                  name="averagePricePerPerson"
                  type="number"
                  placeholder="25000"
                  value={restaurantData.averagePricePerPerson}
                  onChange={handleRestaurantChange}
                  min="0"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingHours" className="text-gray-700 font-medium">
                  Horarios de Atención
                </Label>
                <Input
                  id="openingHours"
                  name="openingHours"
                  type="text"
                  placeholder="Lun-Dom: 12:00-22:00"
                  value={restaurantData.openingHours}
                  onChange={handleRestaurantChange}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-gray-700 font-medium">
                  Latitud (opcional)
                </Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  placeholder="4.6097"
                  value={restaurantData.latitude}
                  onChange={handleRestaurantChange}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-gray-700 font-medium">
                  Longitud (opcional)
                </Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  placeholder="-74.0817"
                  value={restaurantData.longitude}
                  onChange={handleRestaurantChange}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          {/* Menu Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-700 font-medium text-lg">Menú del Restaurante</Label>
              <Button type="button" onClick={addMenuItem} variant="outline" size="sm">
                + Agregar Plato
              </Button>
            </div>

            {menuItems.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`item-name-${index}`} className="text-gray-700 font-medium">
                      Nombre del Plato *
                    </Label>
                    <Input
                      id={`item-name-${index}`}
                      type="text"
                      placeholder="Ej: Pizza Margherita"
                      value={item.name}
                      onChange={(e) => handleMenuItemChange(index, 'name', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-price-${index}`} className="text-gray-700 font-medium">
                      Precio (COP) *
                    </Label>
                    <Input
                      id={`item-price-${index}`}
                      type="number"
                      placeholder="25000"
                      value={item.price}
                      onChange={(e) => handleMenuItemChange(index, 'price', e.target.value)}
                      min="0"
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`item-description-${index}`} className="text-gray-700 font-medium">
                      Descripción
                    </Label>
                    <Input
                      id={`item-description-${index}`}
                      type="text"
                      placeholder="Deliciosa pizza con mozzarella fresca y albahaca"
                      value={item.description}
                      onChange={(e) => handleMenuItemChange(index, 'description', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`item-category-${index}`} className="text-gray-700 font-medium">
                      Categoría
                    </Label>
                    <select
                      id={`item-category-${index}`}
                      value={item.category}
                      onChange={(e) => handleMenuItemChange(index, 'category', e.target.value)}
                      className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="Plato principal">Plato principal</option>
                      <option value="Entrada">Entrada</option>
                      <option value="Postre">Postre</option>
                      <option value="Bebida">Bebida</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  {menuItems.length > 1 && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        onClick={() => removeMenuItem(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Button type="submit" className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white" disabled={loading}>
            {loading ? "Registrando..." : "Registrar Restaurante"}
          </Button>

          <p className="text-center text-xs text-gray-500">
            Al registrar tu restaurante aceptas los términos y condiciones para restaurantes.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}