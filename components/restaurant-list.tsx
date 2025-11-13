import { RestaurantCard } from "./restaurant-card"

interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  cuisine?: string
}

interface RestaurantListProps {
  restaurants: Restaurant[]
  loading?: boolean
}

export function RestaurantList({ restaurants, loading }: RestaurantListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-[var(--color-muted)] rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-muted-foreground)] text-lg">No se encontraron restaurantes en esta búsqueda</p>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-2">
          Intenta con otra ciudad o ajusta tus filtros
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          id={restaurant.id}
          name={restaurant.name}
          address={restaurant.address}
          city={restaurant.city}
          cuisine={restaurant.cuisine}
        />
      ))}
    </div>
  )
}
