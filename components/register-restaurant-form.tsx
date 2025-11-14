"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { registerRestaurant } from "@/lib/api-client"

export function RegisterRestaurantForm() {
  const [formData, setFormData] = useState({
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const restaurantData = {
        ...formData,
        averagePricePerPerson: parseFloat(formData.averagePricePerPerson) || 0,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null
      }

      await registerRestaurant(restaurantData)
      router.push("/profile?restaurantRegistered=true")
    } catch (err) {
      setError("Error al registrar restaurante. Intenta de nuevo.")
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Nombre del Restaurante *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Mi Restaurante"
                value={formData.name}
                onChange={handleChange}
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
                value={formData.cuisineType}
                onChange={handleChange}
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
                value={formData.address}
                onChange={handleChange}
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
                value={formData.phone}
                onChange={handleChange}
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
                value={formData.website}
                onChange={handleChange}
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
                value={formData.averagePricePerPerson}
                onChange={handleChange}
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
                value={formData.openingHours}
                onChange={handleChange}
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
                value={formData.latitude}
                onChange={handleChange}
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
                value={formData.longitude}
                onChange={handleChange}
                className="h-12"
              />
            </div>
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