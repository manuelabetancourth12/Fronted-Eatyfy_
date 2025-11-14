"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "@/lib/api-client"
import { FoodPreferencesSurvey } from "./food-preferences-survey"

export function RegisterForm() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [preferences, setPreferences] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && password) {
      setStep(2)
    }
  }

  const handleSurveyComplete = async (surveyPreferences: any) => {
    setError("")
    setLoading(true)

    try {
      await registerUser({
        name,
        email,
        password,
        foodPreferences: JSON.stringify(surveyPreferences)
      })

      // Redirect to login after successful registration
      router.push("/login?registered=true")
    } catch (err) {
      setError("Error al registrarse. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToBasic = () => {
    setStep(1)
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-center space-x-2">
          {[1, 2].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-3 h-3 rounded-full ${
                stepNum <= step ? "bg-pink-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          Paso {step} de 2
        </p>
      </div>

      {step === 1 && (
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900">Crear cuenta</CardTitle>
            <p className="text-center text-gray-600">Ingresa tus datos básicos</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Nombre completo
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

              <Button type="submit" className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white">
                Continuar
              </Button>

              <p className="text-center text-xs text-gray-500">Al registrarte aceptas los términos y condiciones.</p>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Casi listo!</h2>
            <p className="text-gray-600">Cuéntanos sobre tus gustos para darte mejores recomendaciones</p>
          </div>

          <FoodPreferencesSurvey
            onComplete={handleSurveyComplete}
            showTitle={false}
          />

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleBackToBasic}
              className="px-8"
            >
              ← Volver
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center">
              <div className="inline-flex items-center text-pink-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600 mr-2"></div>
                Creando tu cuenta...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
