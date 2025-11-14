"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchReviewsByRestaurant } from "@/lib/api-client"
import { Star, User, Calendar } from "lucide-react"

interface Review {
  id: number
  user: {
    id: number
    name: string
    email: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface ReviewsListProps {
  restaurantId: number
  limit?: number
}

export function ReviewsList({ restaurantId, limit }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    loadReviews()
  }, [restaurantId])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const data = await fetchReviewsByRestaurant(restaurantId)
      setReviews(data)

      // Calculate average rating
      if (data.length > 0) {
        const avg = data.reduce((sum: number, review: Review) => sum + review.rating, 0) / data.length
        setAverageRating(Math.round(avg * 10) / 10)
      }
    } catch (error) {
      console.error("Error loading reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}/5</span>
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reseñas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mr-3" />
            <span>Cargando reseñas...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayedReviews = limit ? reviews.slice(0, limit) : reviews

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Reseñas
            {reviews.length > 0 && (
              <span className="text-sm font-normal text-gray-600">
                ({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})
              </span>
            )}
          </CardTitle>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              {renderStars(averageRating)}
              <span className="text-sm text-gray-600">
                Promedio: {averageRating}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Aún no hay reseñas</p>
            <p className="text-sm text-gray-500">
              Sé el primero en compartir tu experiencia
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.user.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}

            {limit && reviews.length > limit && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  Ver todas las reseñas ({reviews.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}