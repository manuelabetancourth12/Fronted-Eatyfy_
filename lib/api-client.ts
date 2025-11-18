// API Client for backend communication

const API_BASE_URL = "https://eatyfy-backend-production.up.railway.app/api"

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("eatyfy_token")
  // Only return auth header if token exists and is not expired
  if (token) {
    try {
      // Basic check if token is valid (you might want to decode and check expiration)
      return { Authorization: `Bearer ${token}` }
    } catch (error) {
      // If token is invalid, remove it
      localStorage.removeItem("eatyfy_token")
      localStorage.removeItem("eatyfy_user")
      return {}
    }
  }
  return {}
}

// Fetch restaurants by city, budget, and cuisine
export async function fetchRestaurantsByCity(city?: string, budget?: number, cuisine?: string) {
  const params = new URLSearchParams()
  if (city) params.set("city", city)
  if (budget) params.set("budget", budget.toString())

  const response = await fetch(`${API_BASE_URL}/restaurants/search?${params}`, {
    headers: getAuthHeaders(),
    cache: 'no-cache',
  })

  if (!response.ok) {
    throw new Error("Failed to fetch restaurants")
  }

  const restaurants = await response.json()

  // Transform backend data to match frontend expectations
  return restaurants.map((r: any) => ({
    id: r.id.toString(),
    name: r.name,
    address: r.address,
    city: r.city || city || "Bogotá",
    lat: r.lat || 4.711,
    lon: r.lon || -74.0721,
    cuisine: r.cuisine,
    phone: r.phone,
    website: r.website,
    priceRange: r.priceRange || "$$"
  }))
}

// Fetch restaurant details by ID
export async function fetchRestaurantDetails(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Restaurante no encontrado")
      }
      throw new Error(`Error al cargar detalles del restaurante: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching restaurant details:", error)
    throw error // Re-throw to let the component handle it
  }
}

// Auth functions
export async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  return response.json()
}

export async function registerUser(data: { name: string; email: string; password: string; foodPreferences?: string; role?: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Registration failed")
  }

  return response.json()
}

export async function registerRestaurant(restaurantData: any) {
  const response = await fetch(`${API_BASE_URL}/restaurants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(restaurantData),
  })

  if (!response.ok) {
    throw new Error("Restaurant registration failed")
  }

  return response.json()
}

// User profile functions
export async function fetchUserProfile() {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }

  return response.json()
}

export async function updateUserProfile(data: any) {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update user profile")
  }

  return response.json()
}

// Notifications
export async function fetchNotifications() {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch notifications")
  }

  return response.json()
}

export async function markNotificationAsRead(id: number) {
  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: "PUT",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to mark notification as read")
  }

  return response.json()
}

// Promotions
export async function fetchPromotions(city?: string) {
  try {
    const params = city ? `?city=${encodeURIComponent(city)}` : ""
    const response = await fetch(`${API_BASE_URL}/promotions${params}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      // If promotions endpoint fails, return empty array instead of throwing
      console.warn("Promotions endpoint not available, returning empty array")
      return []
    }

    return response.json()
  } catch (error) {
    // If there's a network error or other issue, return empty array
    console.warn("Error fetching promotions:", error)
    return []
  }
}

// Reviews
export async function fetchReviewsByRestaurant(restaurantId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/restaurant/${restaurantId}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      // If reviews endpoint fails, return empty array instead of throwing
      console.warn("Reviews endpoint not available, returning empty array")
      return []
    }

    return response.json()
  } catch (error) {
    // If there's a network error or other issue, return empty array
    console.warn("Error fetching reviews:", error)
    return []
  }
}

export async function fetchMyReviews() {
  const response = await fetch(`${API_BASE_URL}/reviews/my`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch my reviews")
  }

  return response.json()
}

export async function updateRestaurant(restaurantId: number, restaurantData: any) {
  const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(restaurantData),
  })

  if (!response.ok) {
    throw new Error("Failed to update restaurant")
  }

  return response.json()
}

export async function createReview(review: { restaurant: { id: number }, rating: number, comment: string }) {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(review),
  })

  if (!response.ok) {
    throw new Error("Failed to create review")
  }

  return response.json()
}

// Menu Items
export async function fetchMenuItems(restaurantId: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/menu-items/restaurant/${restaurantId}`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      // If menu items endpoint fails, return empty array instead of throwing
      console.warn("Menu items endpoint not available, returning empty array")
      return []
    }

    return response.json()
  } catch (error) {
    // If there's a network error or other issue, return empty array
    console.warn("Error fetching menu items:", error)
    return []
  }
}

export async function createMenuItem(menuItem: any) {
  const response = await fetch(`${API_BASE_URL}/menu-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(menuItem),
  })

  if (!response.ok) {
    throw new Error("Failed to create menu item")
  }

  return response.json()
}

export async function updateMenuItem(id: number, menuItem: any) {
  const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(menuItem),
  })

  if (!response.ok) {
    throw new Error("Failed to update menu item")
  }

  return response.json()
}

export async function deleteMenuItem(id: number) {
  const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to delete menu item")
  }

  return response.json()
}

// Get current user's restaurants
export async function fetchMyRestaurants() {
  const response = await fetch(`${API_BASE_URL}/restaurants/my`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch my restaurants")
  }

  return response.json()
}

// Recommendations (same as fetchRestaurantsByCity for now)
export async function fetchPersonalizedRecommendations(city?: string, budget?: number) {
  return fetchRestaurantsByCity(city, budget)
}
