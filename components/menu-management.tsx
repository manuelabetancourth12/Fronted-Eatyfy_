"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { fetchMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, fetchUserProfile, fetchMyRestaurants } from "@/lib/api-client"
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  category?: string
}

export function MenuManagement() {
  const router = useRouter()

  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: ""
  })

  useEffect(() => {
    loadRestaurantData()
  }, [])

  const loadRestaurantData = async () => {
    try {
      const userData = await fetchUserProfile()
      if (userData.role !== "RESTAURANT") {
        router.push("/login")
        return
      }

      // Fetch user's restaurants
      const userRestaurants = await fetchMyRestaurants()
      if (userRestaurants.length === 0) {
        alert("No tienes restaurantes registrados. Crea uno primero.")
        router.push("/restaurant-dashboard")
        return
      }

      // Use the first restaurant for now - in a real app, you might want to select which one
      const restaurantIdStr = userRestaurants[0].id.toString()
      setRestaurantId(restaurantIdStr)
      loadMenuItems(restaurantIdStr)
    } catch (error) {
      console.error("Error loading user data:", error)
      router.push("/login")
    }
  }

  const loadMenuItems = async (id: string) => {
    try {
      const items = await fetchMenuItems(parseInt(id))
      setMenuItems(items)
    } catch (error) {
      console.error("Error loading menu items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price) {
      alert("Nombre y precio son obligatorios")
      return
    }

    try {
      if (!restaurantId) {
        alert("Error: No se pudo identificar el restaurante")
        return
      }

      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        restaurant: { id: parseInt(restaurantId) }
      }

      if (editingItem) {
        await updateMenuItem(editingItem.id, menuItemData)
      } else {
        await createMenuItem(menuItemData)
      }

      if (restaurantId) {
        await loadMenuItems(restaurantId)
      }
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving menu item:", error)
      alert("Error al guardar el plato")
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category: item.category || ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este plato?")) {
      return
    }

    try {
      await deleteMenuItem(id)
      if (restaurantId) {
        await loadMenuItems(restaurantId)
      }
    } catch (error) {
      console.error("Error deleting menu item:", error)
      alert("Error al eliminar el plato")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: ""
    })
    setEditingItem(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Gestión de Menú</h1>
          <p className="text-gray-600">Administra los platos de tu restaurante</p>
        </div>
      </div>

      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-pink-500 hover:bg-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Plato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Plato" : "Agregar Nuevo Plato"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Plato *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Pizza Margherita"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe el plato..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="price">Precio (COP) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="25000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Plato principal">Plato Principal</SelectItem>
                    <SelectItem value="Postre">Postre</SelectItem>
                    <SelectItem value="Bebida">Bebida</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                  {editingItem ? "Actualizar" : "Agregar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {menuItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 mb-4">No tienes platos en tu menú aún.</p>
              <Button onClick={openAddDialog} className="bg-pink-500 hover:bg-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Plato
              </Button>
            </CardContent>
          </Card>
        ) : (
          Object.entries(
            menuItems.reduce((acc, item) => {
              const category = item.category || "Sin Categoría"
              if (!acc[category]) acc[category] = []
              acc[category].push(item)
              return acc
            }, {} as Record<string, MenuItem[]>)
          ).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-xl">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item: MenuItem) => (
                    <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className="font-bold text-pink-600">
                          ${item.price?.toLocaleString()}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}