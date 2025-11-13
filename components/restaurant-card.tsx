import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Utensils } from "lucide-react"
import Link from "next/link"

interface RestaurantCardProps {
  id: string
  name: string
  address: string
  city: string
  cuisine?: string
}

export function RestaurantCard({ id, name, address, city, cuisine }: RestaurantCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] mb-1">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{address}</span>
            </div>
            <div className="text-sm text-[var(--color-muted-foreground)]">{city}</div>
          </div>
          {cuisine && (
            <div className="flex items-center gap-1 px-3 py-1 bg-[var(--color-muted)] rounded-full text-xs font-medium whitespace-nowrap">
              <Utensils className="w-3 h-3" />
              {cuisine}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/restaurants/${id}`}>
          <Button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white">
            Ver detalles
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
