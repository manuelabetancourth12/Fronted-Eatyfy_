"use client"

import { useEffect, useRef, memo } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

interface MapViewProps {
  center: [number, number]
  zoom?: number
  markers?: Array<{
    id: string
    name: string
    position: [number, number]
    address?: string
  }>
  onMarkerClick?: (id: string) => void
  className?: string
}

export const MapView = memo(function MapView({ center, zoom = 13, markers = [], onMarkerClick, className = "" }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Create map instance
    const map = L.map(mapContainerRef.current).setView(center, zoom)

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Create markers layer group
    const markersLayer = L.layerGroup().addTo(map)
    markersLayerRef.current = markersLayer

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update map center
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom)
    }
  }, [center, zoom])

  // Update markers
  useEffect(() => {
    if (!markersLayerRef.current) return

    // Clear existing markers
    markersLayerRef.current.clearLayers()

    // Add new markers
    markers.forEach((marker) => {
      const isUserLocation = marker.id === "user-location"
      const markerOptions = isUserLocation ? {
        icon: L.divIcon({
          html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
          className: 'custom-user-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      } : {}

      const leafletMarker = L.marker(marker.position, markerOptions).bindPopup(`
          <div class="text-sm">
            <strong class="font-semibold">${marker.name}</strong>
            ${marker.address ? `<br/><span class="text-gray-600">${marker.address}</span>` : ""}
          </div>
        `)

      if (onMarkerClick && !isUserLocation) {
        leafletMarker.on("click", () => onMarkerClick(marker.id))
      }

      leafletMarker.addTo(markersLayerRef.current!)
    })

    // Fit bounds if there are markers
    if (markers.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(markers.map((m) => m.position))
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [markers, onMarkerClick])

  return <div ref={mapContainerRef} className={`w-full h-full min-h-[400px] rounded-lg ${className}`} />
});
