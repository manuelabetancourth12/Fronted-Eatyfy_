// Colombian cities with coordinates for map centering
export const colombianCities = [
  { name: "Bogotá", lat: 4.711, lon: -74.0721 },
  { name: "Medellín", lat: 6.2442, lon: -75.5812 },
  { name: "Cali", lat: 3.4516, lon: -76.532 },
  { name: "Barranquilla", lat: 10.9685, lon: -74.7813 },
  { name: "Cartagena", lat: 10.391, lon: -75.4794 },
  { name: "Bucaramanga", lat: 7.1254, lon: -73.1198 },
  { name: "Pasto", lat: 1.2136, lon: -77.2811 },
  { name: "Pereira", lat: 4.8087, lon: -75.6906 },
  { name: "Manizales", lat: 5.07, lon: -75.5138 },
  { name: "Cúcuta", lat: 7.8939, lon: -72.5078 },
  { name: "Santa Marta", lat: 11.2408, lon: -74.2099 },
  { name: "Ibagué", lat: 4.4389, lon: -75.2322 },
  { name: "Villavicencio", lat: 4.142, lon: -73.6266 },
] as const

export type ColombianCity = (typeof colombianCities)[number]
