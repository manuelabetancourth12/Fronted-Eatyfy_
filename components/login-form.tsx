"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loginUser } from "@/lib/api-client"

export function LoginForm() {
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
      const response: any = await loginUser({ email, password })

      // Save to localStorage
      localStorage.setItem("eatyfy_token", response.token)
      localStorage.setItem("eatyfy_user", JSON.stringify(response.user))

      // Redirect based on user role
      if (response.user.role === "RESTAURANT") {
        router.push("/restaurant-dashboard")
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-gray-900">Iniciar sesión</CardTitle>
        <CardDescription className="text-center text-gray-600">Ingresa a tu cuenta de Eatyfy</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
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
              className="h-12"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-pink-500 hover:text-pink-600 font-medium">
              Regístrate aquí
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
