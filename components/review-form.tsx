"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createReview } from "@/lib/api-client"
import { Star } from "lucide-react"

interface ReviewFormProps {
  restaurantId: number
  onReviewSubmitted?: () => void
}

export function ReviewForm({ restaurantId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError("Por favor selecciona una calificación")
      return
    }

    setError("")
    setLoading(true)

    try {
      await createReview({
        restaurant: { id: restaurantId },
        rating: rating,
        comment: comment.trim()
      })

      // Reset form
      setRating(0)
      setComment("")
      onReviewSubmitted?.()
    } catch (err) {
      setError("Error al enviar la reseña. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Deja tu reseña</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

          {/* Rating Stars */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Calificación *</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && `${rating} estrella${rating !== 1 ? "s" : ""}`}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-gray-700 font-medium">
              Comentario (opcional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Comparte tu experiencia en este restaurante..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Máximo 500 caracteres. Tu opinión ayuda a otros usuarios.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            disabled={loading || rating === 0}
          >
            {loading ? "Enviando..." : "Enviar reseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}