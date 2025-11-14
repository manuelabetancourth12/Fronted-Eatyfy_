// API Client for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("eatyfy_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Fetch restaurants by city and budget
export async function fetchRestaurantsByCity(city?: string, budget?: number) {
  const params = new URLSearchParams()
  if (city) params.set("city", city)
  if (budget) params.set("budget", budget.toString())

  const response = await fetch(`${API_BASE_URL}/restaurants?${params}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch restaurants")
  }

  return response.json()
}

// Fetch restaurant details by ID
export async function fetchRestaurantDetails(id: string) {
  const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch restaurant details")
  }

  return response.json()
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

export async function registerUser(data: { name: string; email: string; password: string; foodPreferences?: string }) {
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
  const params = city ? `?city=${encodeURIComponent(city)}` : ""
  const response = await fetch(`${API_BASE_URL}/promotions${params}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch promotions")
  }

  return response.json()
}

// Reviews
export async function fetchReviewsByRestaurant(restaurantId: number) {
  const response = await fetch(`${API_BASE_URL}/reviews/restaurant/${restaurantId}`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch reviews")
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
