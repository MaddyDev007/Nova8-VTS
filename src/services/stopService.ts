import type { StopEvent } from '../types/events'
import type { TripPlaybackPoint } from '../types/trip'
import { geofenceService } from './geofenceService'

export type StopEventFilters = {
  vehicleId?: string
  minDuration?: number
  startDate?: string
  endDate?: string
}

export type StopLocation = {
  id: string
  name: string
  lat: number
  lon: number
}

const STOP_EVENTS = 40
const BASE_LAT = 28.6139
const BASE_LON = 77.209

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}

function generateMockStopEvents(): StopEvent[] {
  return Array.from({ length: STOP_EVENTS }, (_, index) => {
    const vehicleNo = (index % 10) + 1
    const duration = randomInt(1, 55)
    const endTimeMs = Date.now() - index * 95 * 60 * 1000
    const startTimeMs = endTimeMs - duration * 60 * 1000

    return {
      id: `stp-${String(index + 1).padStart(4, '0')}`,
      vehicleId: `veh-${vehicleNo}`,
      vehicleName: `VTS Vehicle ${vehicleNo}`,
      tripId: `trip-${String((index % 12) + 1).padStart(3, '0')}`,
      duration,
      startTime: new Date(startTimeMs).toISOString(),
      endTime: new Date(endTimeMs).toISOString(),
      location: `Sector ${randomInt(10, 95)}, New Delhi`,
      lat: Number((BASE_LAT + vehicleNo * 0.01 + randomBetween(-0.02, 0.02)).toFixed(6)),
      lon: Number((BASE_LON + vehicleNo * 0.01 + randomBetween(-0.02, 0.02)).toFixed(6)),
    }
  }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
}

let mockStopEvents: StopEvent[] = generateMockStopEvents()

function applyFilters(events: StopEvent[], filters?: StopEventFilters): StopEvent[] {
  if (!filters) {
    return events
  }

  return events.filter((event) => {
    const matchesVehicle = filters.vehicleId ? event.vehicleId === filters.vehicleId : true
    const matchesDuration = filters.minDuration ? event.duration > filters.minDuration : true
    const matchesStartDate = filters.startDate
      ? new Date(event.startTime).getTime() >= new Date(filters.startDate).getTime()
      : true
    const matchesEndDate = filters.endDate
      ? new Date(event.startTime).getTime() <= new Date(filters.endDate).getTime()
      : true

    return matchesVehicle && matchesDuration && matchesStartDate && matchesEndDate
  })
}

function generatePlayback(event: StopEvent): TripPlaybackPoint[] {
  const pointCount = randomInt(8, 24)
  const startMs = new Date(event.startTime).getTime()
  const endMs = new Date(event.endTime).getTime()
  const stepMs = Math.max(20 * 1000, Math.floor((endMs - startMs) / Math.max(1, pointCount - 1)))

  return Array.from({ length: pointCount }, (_, index) => ({
    timestamp: new Date(startMs + stepMs * index).toISOString(),
    lat: Number((event.lat + randomBetween(-0.0012, 0.0012)).toFixed(6)),
    lon: Number((event.lon + randomBetween(-0.0012, 0.0012)).toFixed(6)),
    speed: randomInt(0, 2),
  }))
}

class StopService {
  async getStopEvents(filters?: StopEventFilters): Promise<StopEvent[]> {
    // TODO: Replace with REST call (e.g. GET /events/stop)
    return applyFilters(mockStopEvents, filters)
  }

  async getStopEventById(eventId: string): Promise<StopEvent | null> {
    // TODO: Replace with REST call (e.g. GET /events/stop/:id)
    return mockStopEvents.find((event) => event.id === eventId) ?? null
  }

  async getStopPlayback(eventId: string): Promise<TripPlaybackPoint[]> {
    // TODO: Replace with REST call (e.g. GET /events/stop/:id)
    const event = mockStopEvents.find((item) => item.id === eventId)
    if (!event) {
      return []
    }

    return generatePlayback(event)
  }

  async getStopLocations(): Promise<StopLocation[]> {
    // TODO: Replace with REST call (e.g. GET /stops?isStop=true)
    const geofences = await geofenceService.getGeofences()

    const stops = geofences
      .filter((geofence) => geofence.isStop === true)
      .map((geofence) => ({
        id: geofence.id,
        name: geofence.name,
        lat: geofence.lat,
        lon: geofence.lon,
      }))

    console.debug('Loaded route stops:', stops)

    return stops
  }
}

export const stopService = new StopService()
