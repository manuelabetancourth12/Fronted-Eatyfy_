// Colombian cities data fetched from backend API
export interface ColombianCity {
  name: string
  name_normalized: string
  lat: number
  lon: number
  country: string
  population: number
  timezone: string
}

// Cache for cities data
let citiesCache: ColombianCity[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Fetch cities from backend API
export async function fetchColombianCities(): Promise<ColombianCity[]> {
  // Check cache first
  const now = Date.now()
  if (citiesCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return citiesCache
  }

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8084"
    const response = await fetch(`${API_BASE_URL}/api/cities/list`)

    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.status}`)
    }

    const cities: ColombianCity[] = await response.json()
    citiesCache = cities
    cacheTimestamp = now

    return cities
  } catch (error) {
    console.error("Error fetching cities from backend:", error)

    // Fallback to basic cities if backend is unavailable
    const fallbackCities: ColombianCity[] = [
      { name: "Bogotá", name_normalized: "bogota", lat: 4.711, lon: -74.0721, country: "Colombia", population: 7181000, timezone: "America/Bogota" },
      { name: "Medellín", name_normalized: "medellin", lat: 6.2442, lon: -75.5812, country: "Colombia", population: 2529000, timezone: "America/Bogota" },
      { name: "Cali", name_normalized: "cali", lat: 3.4516, lon: -76.532, country: "Colombia", population: 2228000, timezone: "America/Bogota" },
      { name: "Barranquilla", name_normalized: "barranquilla", lat: 10.9685, lon: -74.7813, country: "Colombia", population: 1206000, timezone: "America/Bogota" },
    ]

    citiesCache = fallbackCities
    cacheTimestamp = now

    return fallbackCities
  }
}

// Legacy export for backward compatibility - returns empty array initially
// Components should use fetchColombianCities() instead
export const colombianCities: ColombianCity[] = []

// Helper function to find city by name
export async function findCityByName(name: string): Promise<ColombianCity | null> {
  const cities = await fetchColombianCities()
  const normalizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  return cities.find(city =>
    city.name.toLowerCase() === normalizedName ||
    city.name_normalized === normalizedName
  ) || null
}

// Helper function to get city coordinates
export async function getCityCoordinates(cityName: string): Promise<{lat: number, lon: number} | null> {
  const city = await findCityByName(cityName)
  return city ? { lat: city.lat, lon: city.lon } : null
}
