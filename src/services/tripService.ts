import type { Trip, TripPlaybackPoint } from '../types/trip'

const TRIP_COUNT = 12
const BASE_LAT = 28.6139
const BASE_LON = 77.209

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}

function buildTimeRange(hoursAgoStart: number, durationMinutes: number): { startTime: string; endTime: string } {
  const endMs = Date.now() - hoursAgoStart * 60 * 60 * 1000
  const startMs = endMs - durationMinutes * 60 * 1000
  return {
    startTime: new Date(startMs).toISOString(),
    endTime: new Date(endMs).toISOString(),
  }
}

function generateMockTrips(): Trip[] {
  return Array.from({ length: TRIP_COUNT }, (_, index) => {
    const vehicleNo = (index % 10) + 1
    const duration = randomInt(35, 210)
    const distance = Number(randomBetween(6, 145).toFixed(1))
    const { startTime, endTime } = buildTimeRange(index * 5 + 3, duration)

    return {
      id: `trip-${String(index + 1).padStart(3, '0')}`,
      vehicleId: `veh-${vehicleNo}`,
      vehicleName: `VTS Vehicle ${vehicleNo}`,
      startLocation: `Sector ${randomInt(10, 45)}, New Delhi`,
      endLocation: `Sector ${randomInt(46, 90)}, New Delhi`,
      startTime,
      endTime,
      duration,
      distance,
    }
  })
}

const mockTrips: Trip[] = generateMockTrips()

function generatePlaybackPoints(trip: Trip): TripPlaybackPoint[] {
  const pointCount = randomInt(20, 42)
  const startMs = new Date(trip.startTime).getTime()
  const endMs = new Date(trip.endTime).getTime()
  const totalMs = Math.max(endMs - startMs, pointCount * 60 * 1000)
  const stepMs = Math.max(30 * 1000, Math.floor(totalMs / pointCount))

  const routeSeed = Number(trip.vehicleId.replace('veh-', '')) || 1
  const startLat = BASE_LAT + routeSeed * 0.01 + randomBetween(-0.03, 0.03)
  const startLon = BASE_LON + routeSeed * 0.01 + randomBetween(-0.03, 0.03)
  const deltaLat = randomBetween(0.03, 0.12)
  const deltaLon = randomBetween(0.03, 0.12)

  return Array.from({ length: pointCount }, (_, index) => {
    const progress = index / Math.max(1, pointCount - 1)

    return {
      timestamp: new Date(startMs + stepMs * index).toISOString(),
      lat: Number((startLat + deltaLat * progress + randomBetween(-0.002, 0.002)).toFixed(6)),
      lon: Number((startLon + deltaLon * progress + randomBetween(-0.002, 0.002)).toFixed(6)),
      speed: randomInt(10, 78),
    }
  })
}

class TripService {
  async getTrips(): Promise<Trip[]> {
    // TODO: Replace with REST call (e.g. GET /trips)
    return mockTrips
  }

  async getTripById(tripId: string): Promise<Trip | null> {
    // TODO: Replace with REST call (e.g. GET /trips/:tripId)
    return mockTrips.find((trip) => trip.id === tripId) ?? null
  }

  async getTripPlayback(tripId: string): Promise<TripPlaybackPoint[]> {
    // TODO: Replace with REST call (e.g. GET /trips/:tripId/playback)
    const trip = mockTrips.find((item) => item.id === tripId)
    if (!trip) {
      return []
    }

    return generatePlaybackPoints(trip)
  }
}

export const tripService = new TripService()
