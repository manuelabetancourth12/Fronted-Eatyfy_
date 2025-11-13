// API Client for backend communication
// TODO: connect to Spring Boot backend here

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Fetch restaurants by city and budget using Overpass API
export async function fetchRestaurantsByCity(city: string, budget?: number) {
  // TODO: Eventually this should call the Spring Boot backend
  // For now, we use Overpass API directly

  const cityData = await import("./colombian-cities").then((m) => m.colombianCities.find((c) => c.name === city))

  if (!cityData) {
    throw new Error("City not found")
  }

  // Overpass API query to get restaurants
  const query = `
    [out:json];
    (
      node["amenity"="restaurant"](around:5000,${cityData.lat},${cityData.lon});
      way["amenity"="restaurant"](around:5000,${cityData.lat},${cityData.lon});
    );
    out body;
    >;
    out skel qt;
  `

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch restaurants")
  }

  const data = await response.json()

  // Transform Overpass data to our restaurant format
  // TODO: adjust Overpass query for better restaurant results
  const restaurants = data.elements
    .filter((el: any) => el.type === "node" && el.tags)
    .map((el: any) => ({
      id: el.id.toString(),
      name: el.tags.name || "Restaurante sin nombre",
      address: el.tags["addr:street"] || el.tags.address || "Dirección no disponible",
      city: city,
      lat: el.lat,
      lon: el.lon,
      cuisine: el.tags.cuisine || "No especificado",
      phone: el.tags.phone || null,
      website: el.tags.website || null,
    }))

  return restaurants
}

// Fetch restaurant details by ID
export async function fetchRestaurantDetails(id: string) {
  // TODO: connect to Spring Boot backend here

  const query = `
    [out:json];
    node(${id});
    out body;
  `

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch restaurant details")
  }

  const data = await response.json()

  if (data.elements.length === 0) {
    throw new Error("Restaurant not found")
  }

  const el = data.elements[0]

  return {
    id: el.id.toString(),
    name: el.tags?.name || "Restaurante sin nombre",
    address: el.tags?.["addr:street"] || el.tags?.address || "Dirección no disponible",
    lat: el.lat,
    lon: el.lon,
    cuisine: el.tags?.cuisine || "No especificado",
    phone: el.tags?.phone || null,
    website: el.tags?.website || null,
    opening_hours: el.tags?.opening_hours || null,
  }
}

// Auth functions
export async function loginUser(credentials: { email: string; password: string }) {
  // TODO: connect to Spring Boot backend here
  // Mock implementation for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: "mock-jwt-token",
        user: {
          id: "1",
          name: credentials.email.split("@")[0],
          email: credentials.email,
        },
      })
    }, 500)
  })
}

export async function registerUser(data: { name: string; email: string; password: string }) {
  // TODO: connect to Spring Boot backend here
  // Mock implementation for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: "Usuario registrado exitosamente",
      })
    }, 500)
  })
}

// User profile functions
export async function fetchUserProfile() {
  // TODO: connect to Spring Boot backend here
  const userData = localStorage.getItem("eatyfy_user")
  if (userData) {
    return JSON.parse(userData)
  }
  throw new Error("No user logged in")
}

export async function updateUserProfile(data: any) {
  // TODO: connect to Spring Boot backend here
  // Mock implementation for now
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedUser = { ...data }
      localStorage.setItem("eatyfy_user", JSON.stringify(updatedUser))
      resolve(updatedUser)
    }, 500)
  })
}

// Notifications (mock)
export async function fetchNotifications() {
  // TODO: fetch notifications from backend
  return [
    {
      id: "1",
      title: "Nueva promoción en tu ciudad",
      description: "¡Descuento del 20% en restaurantes seleccionados de Bogotá!",
      date: "2025-01-13",
      read: false,
    },
    {
      id: "2",
      title: "Restaurante recomendado",
      description: "Descubre este nuevo lugar que se ajusta a tu presupuesto",
      date: "2025-01-12",
      read: false,
    },
  ]
}

// Promotions (mock)
export async function fetchPromotions(city?: string) {
  // TODO: fetch promotions from backend
  return [
    {
      id: "1",
      title: "Descuento del 20% en Pasto",
      description: "Disfruta de un 20% de descuento en restaurantes seleccionados",
      city: "Pasto",
      image: "/restaurant-promotion.png",
    },
    {
      id: "2",
      title: "2x1 en hamburguesas",
      description: "¡Lleva dos hamburguesas por el precio de una en Medellín!",
      city: "Medellín",
      image: "/delicious-burger-deal.png",
    },
  ]
}
