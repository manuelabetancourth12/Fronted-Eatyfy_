"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "@/lib/api-client"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [foodPreferences, setFoodPreferences] = useState("")
  const [dietaryRestrictions, setDietaryRestrictions] = useState("")
  const [favoriteCuisine, setFavoriteCuisine] = useState("")
  const [diningFrequency, setDiningFrequency] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const preferences = {
        favoriteCuisine,
        dietaryRestrictions,
        diningFrequency,
        additionalNotes: foodPreferences
      }

      await registerUser({
        name,
        email,
        password,
        foodPreferences: JSON.stringify(preferences)
      })

      // Redirect to login after successful registration
      router.push("/login?registered=true")
    } catch (err) {
      setError("Error al registrarse. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-900">Registrarse</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Nombre
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12"
            />
          </div>

          {/* Food Preferences Survey */}
          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cuéntanos sobre tus gustos gastronómicos</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="favoriteCuisine" className="text-gray-700 font-medium">
                  Tipo de comida favorita
                </Label>
                <select
                  id="favoriteCuisine"
                  value={favoriteCuisine}
                  onChange={(e) => setFavoriteCuisine(e.target.value)}
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="italiana">Italiana</option>
                  <option value="mexicana">Mexicana</option>
                  <option value="japonesa">Japonesa</option>
                  <option value="china">China</option>
                  <option value="colombiana">Colombiana</option>
                  <option value="mediterranea">Mediterránea</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions" className="text-gray-700 font-medium">
                  Restricciones alimentarias (opcional)
                </Label>
                <select
                  id="dietaryRestrictions"
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Ninguna</option>
                  <option value="vegetariano">Vegetariano</option>
                  <option value="vegano">Vegano</option>
                  <option value="sin_gluten">Sin gluten</option>
                  <option value="alergia_mariscos">Alergia a mariscos</option>
                  <option value="alergia_nueces">Alergia a nueces</option>
                  <option value="otra">Otra</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diningFrequency" className="text-gray-700 font-medium">
                  ¿Con qué frecuencia comes fuera de casa?
                </Label>
                <select
                  id="diningFrequency"
                  value={diningFrequency}
                  onChange={(e) => setDiningFrequency(e.target.value)}
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="diario">Diariamente</option>
                  <option value="semanal">Varias veces por semana</option>
                  <option value="mensual">Una vez al mes</option>
                  <option value="ocasional">Ocasionalmente</option>
                  <option value="nunca">Casi nunca</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foodPreferences" className="text-gray-700 font-medium">
                  Comentarios adicionales (opcional)
                </Label>
                <textarea
                  id="foodPreferences"
                  placeholder="Cuéntanos más sobre tus preferencias alimentarias..."
                  value={foodPreferences}
                  onChange={(e) => setFoodPreferences(e.target.value)}
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </Button>

          <p className="text-center text-xs text-gray-500">Al registrarte aceptas los términos y condiciones.</p>
        </form>
      </CardContent>
    </Card>
  )
}
