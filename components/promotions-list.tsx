"use client"

import { useState, useEffect } from "react"
import { fetchPromotions } from "@/lib/api-client"
import { Tag } from "lucide-react"

interface Promotion {
  id: string
  title: string
  description: string
  city: string
  image?: string
}

export function PromotionsList() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPromotions()
  }, [])

  const loadPromotions = async () => {
    setLoading(true)
    try {
      // TODO: fetch promotions from backend
      const data = await fetchPromotions()
      setPromotions(data)
    } catch (error) {
      console.error("[v0] Error loading promotions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-sm text-[var(--color-muted-foreground)]">Cargando promociones...</div>
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-8">
        <Tag className="w-12 h-12 text-[var(--color-muted-foreground)] mx-auto mb-2" />
        <p className="text-sm text-[var(--color-muted-foreground)]">No hay promociones disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {promotions.map((promotion) => (
        <div key={promotion.id} className="rounded-lg overflow-hidden border border-[var(--color-border)]">
          {promotion.image && (
            <img
              src={promotion.image || "/placeholder.svg"}
              alt={promotion.title}
              className="w-full h-32 object-cover"
            />
          )}
          <div className="p-4">
            <h4 className="font-semibold mb-1">{promotion.title}</h4>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-2">{promotion.description}</p>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-accent)]/10 rounded text-xs font-medium text-[var(--color-accent)]">
              {promotion.city}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
