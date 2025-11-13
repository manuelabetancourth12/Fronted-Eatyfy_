"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { NotificationsPanel } from "./notifications-panel"
import { PromotionsList } from "./promotions-list"
import { fetchUserProfile, updateUserProfile } from "@/lib/api-client"
import { User, Mail, Camera, Save, Loader2 } from "lucide-react"

export function UserProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const userData = await fetchUserProfile()
      setUser(userData)
      setName(userData.name || "")
      setEmail(userData.email || "")
      setProfileImage(userData.profileImage || null)
    } catch (error) {
      console.error("[v0] Error loading profile:", error)
      // If not logged in, redirect to login
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updatedData = {
        ...user,
        name,
        email,
        profileImage,
      }

      await updateUserProfile(updatedData)
      setUser(updatedData)

      // Show success message
      alert("Perfil actualizado exitosamente")
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      alert("Error al actualizar el perfil")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="flex-1 bg-[var(--color-muted)] flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-muted-foreground)]">Cargando perfil...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 bg-[var(--color-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mi perfil</h1>
          <p className="text-[var(--color-muted-foreground)] text-lg">
            Administra tu información personal y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-[var(--color-muted)] flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                          <img
                            src={profileImage || "/placeholder.svg"}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-[var(--color-muted-foreground)]" />
                        )}
                      </div>
                      <label
                        htmlFor="profile-image"
                        className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[var(--color-primary-dark)] transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Foto de perfil</p>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        Haz clic en el ícono para cambiar tu imagen
                      </p>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nombre completo
                    </Label>
                    <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Correo electrónico
                    </Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  {/* Save Button */}
                  <Button
                    type="submit"
                    className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white"
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
                        Guardar cambios
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationsPanel />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Promotions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Promociones para ti</CardTitle>
              </CardHeader>
              <CardContent>
                <PromotionsList />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
