import type { TripPlaybackPoint } from '../types/trip'
import type { OverspeedEvent } from '../types/events'

export type OverspeedEventFilters = {
  vehicleId?: string
  speedLimit?: number
  startDate?: string
  endDate?: string
}

const OVERSPEED_EVENTS = 36
const BASE_LAT = 28.6139
const BASE_LON = 77.209
const SPEED_LIMIT_OPTIONS = [40, 60, 80]

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}

function generateMockOverspeedEvents(): OverspeedEvent[] {
  return Array.from({ length: OVERSPEED_EVENTS }, (_, index) => {
    const vehicleNo = (index % 10) + 1
    const speedLimit = SPEED_LIMIT_OPTIONS[index % SPEED_LIMIT_OPTIONS.length]
    const maxSpeed = speedLimit + randomInt(8, 35)
    const duration = randomInt(2, 28)
    const endTimeMs = Date.now() - index * 2 * 60 * 60 * 1000
    const startTimeMs = endTimeMs - duration * 60 * 1000
    const lat = Number((BASE_LAT + vehicleNo * 0.01 + randomBetween(-0.03, 0.03)).toFixed(6))
    const lon = Number((BASE_LON + vehicleNo * 0.01 + randomBetween(-0.03, 0.03)).toFixed(6))

    return {
      id: `ose-${String(index + 1).padStart(4, '0')}`,
      vehicleId: `veh-${vehicleNo}`,
      vehicleName: `VTS Vehicle ${vehicleNo}`,
      tripId: `trip-${String((index % 12) + 1).padStart(3, '0')}`,
      maxSpeed,
      speedLimit,
      duration,
      startTime: new Date(startTimeMs).toISOString(),
      endTime: new Date(endTimeMs).toISOString(),
      location: `Sector ${randomInt(10, 90)}, New Delhi`,
      lat,
      lon,
    }
  }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
}

let mockOverspeedEvents: OverspeedEvent[] = generateMockOverspeedEvents()

function applyFilters(rows: OverspeedEvent[], filters?: OverspeedEventFilters): OverspeedEvent[] {
  if (!filters) {
    return rows
  }

  return rows.filter((row) => {
    const matchesVehicle = filters.vehicleId ? row.vehicleId === filters.vehicleId : true
    const matchesSpeedLimit = filters.speedLimit ? row.speedLimit === filters.speedLimit : true
    const matchesStartDate = filters.startDate
      ? new Date(row.startTime).getTime() >= new Date(filters.startDate).getTime()
      : true
    const matchesEndDate = filters.endDate
      ? new Date(row.startTime).getTime() <= new Date(filters.endDate).getTime()
      : true

    return matchesVehicle && matchesSpeedLimit && matchesStartDate && matchesEndDate
  })
}

function generatePlayback(event: OverspeedEvent): TripPlaybackPoint[] {
  const points = randomInt(15, 32)
  const startMs = new Date(event.startTime).getTime()
  const endMs = new Date(event.endTime).getTime()
  const stepMs = Math.max(15 * 1000, Math.floor((endMs - startMs) / Math.max(1, points - 1)))

  const pathSpread = 0.015
  const startLat = event.lat + randomBetween(-0.01, 0.01)
  const startLon = event.lon + randomBetween(-0.01, 0.01)

  return Array.from({ length: points }, (_, index) => {
    const progress = index / Math.max(1, points - 1)

    return {
      timestamp: new Date(startMs + stepMs * index).toISOString(),
      lat: Number((startLat + progress * pathSpread + randomBetween(-0.0012, 0.0012)).toFixed(6)),
      lon: Number((startLon + progress * pathSpread + randomBetween(-0.0012, 0.0012)).toFixed(6)),
      speed: randomInt(event.speedLimit + 1, event.maxSpeed),
    }
  })
}

class OverspeedService {
  async getOverspeedEvents(filters?: OverspeedEventFilters): Promise<OverspeedEvent[]> {
    // TODO: Replace with REST call (e.g. GET /events/overspeed)
    return applyFilters(mockOverspeedEvents, filters)
  }

  async getOverspeedEventById(eventId: string): Promise<OverspeedEvent | null> {
    // TODO: Replace with REST call (e.g. GET /events/overspeed/:id)
    return mockOverspeedEvents.find((event) => event.id === eventId) ?? null
  }

  async getOverspeedPlayback(eventId: string): Promise<TripPlaybackPoint[]> {
    // TODO: Replace with REST call (e.g. GET /events/overspeed/:id)
    const event = mockOverspeedEvents.find((item) => item.id === eventId)
    if (!event) {
      return []
    }

    return generatePlayback(event)
  }
}

export const overspeedService = new OverspeedService()
