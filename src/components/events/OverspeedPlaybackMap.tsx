import { useEffect, useMemo } from 'react'
import { LayersControl, MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import type { TripPlaybackPoint } from '../../types/trip'
import { convertTelemetryToPolyline } from '../../utils/polylineUtils'
import { createLocationIcon } from '@utils/leafletIcons'
import 'leaflet/dist/leaflet.css'

type OverspeedPlaybackMapProps = {
  routePoints: TripPlaybackPoint[]
  speedLimit: number
  currentPointIndex?: number
}

type MapViewUpdaterProps = {
  center: [number, number]
}

const DEFAULT_CENTER: [number, number] = [28.6139, 77.209]

function MapViewUpdater({ center }: MapViewUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true })
  }, [center, map])

  return null
}

function buildRouteSegments(routePoints: TripPlaybackPoint[], speedLimit: number): Array<{
  points: Array<[number, number]>
  overspeed: boolean
}> {
  if (routePoints.length < 2) {
    return []
  }

  const segments: Array<{ points: Array<[number, number]>; overspeed: boolean }> = []
  let currentSegment: { points: Array<[number, number]>; overspeed: boolean } | null = null

  for (let index = 0; index < routePoints.length - 1; index += 1) {
    const current = routePoints[index]
    const next = routePoints[index + 1]
    const overspeed = current.speed > speedLimit || next.speed > speedLimit
    const startPoint: [number, number] = [current.lat, current.lon]
    const endPoint: [number, number] = [next.lat, next.lon]

    if (!currentSegment || currentSegment.overspeed !== overspeed) {
      currentSegment = { overspeed, points: [startPoint, endPoint] }
      segments.push(currentSegment)
      continue
    }

    currentSegment.points.push(endPoint)
  }

  return segments
}

export function OverspeedPlaybackMap({
  routePoints,
  speedLimit,
  currentPointIndex = 0,
}: OverspeedPlaybackMapProps) {
  const positions = useMemo<[number, number][]>(
    () => convertTelemetryToPolyline(routePoints),
    [routePoints],
  )
  const routeSegments = useMemo(() => buildRouteSegments(routePoints, speedLimit), [routePoints, speedLimit])

  const boundedIndex = routePoints.length
    ? Math.max(0, Math.min(routePoints.length - 1, currentPointIndex))
    : 0
  const startPoint = routePoints[0] ?? null
  const endPoint = routePoints[routePoints.length - 1] ?? null
  const currentPoint = routePoints[boundedIndex] ?? null
  const overspeedPoint = routePoints.find((point) => point.speed > speedLimit) ?? null

  const center = currentPoint
    ? ([currentPoint.lat, currentPoint.lon] as [number, number])
    : startPoint
      ? ([startPoint.lat, startPoint.lon] as [number, number])
      : DEFAULT_CENTER

  return (
    <div className='h-full min-h-[360px] w-full'>
      <MapContainer center={center} zoom={13} className='h-full w-full rounded-xl' scrollWheelZoom={false}>
        <MapViewUpdater center={center} />
        <LayersControl position='topright'>
          <LayersControl.BaseLayer name='OpenStreetMap'>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name='Satellite'>
            <TileLayer
              attribution='Tiles &copy; Esri'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {positions.length > 1 ? (
          <Polyline positions={positions} pathOptions={{ color: '#06b6d4', weight: 4, opacity: 0.45 }} />
        ) : null}

        {routeSegments.map((segment, index) => (
          <Polyline
            key={`segment-${index}-${segment.overspeed ? 'over' : 'normal'}`}
            positions={segment.points}
            pathOptions={{
              color: segment.overspeed ? '#ef4444' : '#06b6d4',
              weight: segment.overspeed ? 5 : 4,
            }}
          />
        ))}

        {startPoint ? (
          <Marker position={[startPoint.lat, startPoint.lon]} icon={createLocationIcon({ color: '#22c55e', size: 30 })} />
        ) : null}

        {overspeedPoint ? (
          <Marker position={[overspeedPoint.lat, overspeedPoint.lon]} icon={createLocationIcon({ color: '#ef4444', size: 30 })} />
        ) : null}

        {endPoint ? (
          <Marker position={[endPoint.lat, endPoint.lon]} icon={createLocationIcon({ color: '#0ea5e9', size: 30 })} />
        ) : null}

        {currentPoint ? (
          <Marker
            position={[currentPoint.lat, currentPoint.lon]}
            icon={createLocationIcon({ color: '#2563eb', size: 30, pulse: true })}
          />
        ) : null}
      </MapContainer>
    </div>
  )
}
