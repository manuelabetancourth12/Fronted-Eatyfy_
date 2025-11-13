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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await registerUser({ name, email, password })

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

          <Button type="submit" className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </Button>

          <p className="text-center text-xs text-gray-500">Al registrarte aceptas los términos y condiciones.</p>
        </form>
      </CardContent>
    </Card>
  )
}
