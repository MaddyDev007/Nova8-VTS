import type { HistoryPoint, VehicleHistory } from '../types/history'

const HISTORY_VEHICLE_COUNT = 10
const BASE_LAT = 28.6139
const BASE_LON = 77.209

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}

function generateMockVehiclesHistory(): VehicleHistory[] {
  return Array.from({ length: HISTORY_VEHICLE_COUNT }, (_, index) => {
    const vehicleNo = index + 1
    const lastSeenMs = Date.now() - index * randomInt(8, 40) * 60 * 1000

    return {
      vehicleId: `veh-${vehicleNo}`,
      vehicleName: `VTS Vehicle ${vehicleNo}`,
      lastLocation: `Sector ${randomInt(10, 95)}, New Delhi`,
      lastSeen: new Date(lastSeenMs).toISOString(),
      totalDistance: Number(randomBetween(320, 5200).toFixed(1)),
      totalTrips: randomInt(25, 420),
    }
  }).sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime())
}

function generateTimeline(vehicleId: string): HistoryPoint[] {
  const seed = Number(vehicleId.replace('veh-', '')) || 1
  const pointCount = randomInt(35, 75)
  const endMs = Date.now()
  const startMs = endMs - randomInt(2, 10) * 60 * 60 * 1000
  const stepMs = Math.max(45 * 1000, Math.floor((endMs - startMs) / Math.max(1, pointCount - 1)))
  const startLat = BASE_LAT + seed * 0.01 + randomBetween(-0.02, 0.02)
  const startLon = BASE_LON + seed * 0.01 + randomBetween(-0.02, 0.02)

  return Array.from({ length: pointCount }, (_, index) => {
    const progress = index / Math.max(1, pointCount - 1)
    const speed = randomInt(0, 75)

    return {
      timestamp: new Date(startMs + index * stepMs).toISOString(),
      lat: Number((startLat + progress * randomBetween(0.02, 0.08) + randomBetween(-0.0015, 0.0015)).toFixed(6)),
      lon: Number((startLon + progress * randomBetween(0.02, 0.08) + randomBetween(-0.0015, 0.0015)).toFixed(6)),
      speed,
      ignition: speed > 0,
      address: `Road ${randomInt(10, 350)}, New Delhi`,
    }
  })
}

let mockVehiclesHistory: VehicleHistory[] = generateMockVehiclesHistory()

class HistoryService {
  async getVehiclesHistory(): Promise<VehicleHistory[]> {
    // TODO: Replace with REST call (GET /history)
    return mockVehiclesHistory
  }

  async getVehicleHistory(vehicleId: string): Promise<VehicleHistory | null> {
    // TODO: Replace with REST call (GET /history/:vehicleId)
    return mockVehiclesHistory.find((item) => item.vehicleId === vehicleId) ?? null
  }

  async getVehicleHistoryTimeline(vehicleId: string): Promise<HistoryPoint[]> {
    // TODO: Replace with REST call (GET /history/:vehicleId/timeline)
    const vehicle = mockVehiclesHistory.find((item) => item.vehicleId === vehicleId)
    if (!vehicle) {
      return []
    }

    return generateTimeline(vehicleId)
  }
}

export const historyService = new HistoryService()
