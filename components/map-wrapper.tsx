"use client"

import dynamic from "next/dynamic"

const MapView = dynamic(() => import("./map-view").then((mod) => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] rounded-lg bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
})

interface MapWrapperProps {
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

export function MapWrapper(props: MapWrapperProps) {
  return <MapView {...props} />
}
