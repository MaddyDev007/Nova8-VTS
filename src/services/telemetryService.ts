import type { TelemetryFilter, TelemetryRecord } from '../types/telemetry'

const TELEMETRY_ROWS = 100
const BASE_LAT = 28.6139
const BASE_LON = 77.209

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}

function generateMockTelemetry(): TelemetryRecord[] {
  return Array.from({ length: TELEMETRY_ROWS }, (_, index) => {
    const vehicleNo = (index % 10) + 1
    const speed = randomInt(0, 92)
    const ignition = speed > 0
    const timestamp = new Date(Date.now() - index * 6 * 60 * 1000).toISOString()

    return {
      id: `tel-${String(index + 1).padStart(4, '0')}`,
      vehicleId: `veh-${vehicleNo}`,
      vehicleName: `VTS Vehicle ${vehicleNo}`,
      deviceId: `VTU_${String(vehicleNo).padStart(3, '0')}`,
      timestamp,
      lat: Number((BASE_LAT + vehicleNo * 0.01 + randomBetween(-0.05, 0.05)).toFixed(6)),
      lon: Number((BASE_LON + vehicleNo * 0.01 + randomBetween(-0.05, 0.05)).toFixed(6)),
      address: `Sector ${randomInt(10, 95)}, New Delhi`,
      speed,
      ignition,
      battery: randomInt(25, 100),
      signal: randomInt(35, 100),
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

let mockTelemetry: TelemetryRecord[] = generateMockTelemetry()

function applyFilters(rows: TelemetryRecord[], filters?: TelemetryFilter): TelemetryRecord[] {
  if (!filters) {
    return rows
  }

  return rows.filter((row) => {
    const matchesVehicle = filters.vehicleId ? row.vehicleId === filters.vehicleId : true
    const matchesIgnition =
      typeof filters.ignition === 'boolean' ? row.ignition === filters.ignition : true
    const matchesStartDate = filters.startDate
      ? new Date(row.timestamp).getTime() >= new Date(filters.startDate).getTime()
      : true
    const matchesEndDate = filters.endDate
      ? new Date(row.timestamp).getTime() <= new Date(filters.endDate).getTime()
      : true

    return matchesVehicle && matchesIgnition && matchesStartDate && matchesEndDate
  })
}

class TelemetryService {
  async getTelemetry(filters?: TelemetryFilter): Promise<TelemetryRecord[]> {
    // TODO: Replace with REST call (e.g. GET /telemetry and GET /telemetry?vehicleId=...)
    return applyFilters(mockTelemetry, filters)
  }

  async getTelemetryByVehicle(vehicleId: string): Promise<TelemetryRecord[]> {
    // TODO: Replace with REST call (e.g. GET /telemetry?vehicleId=:vehicleId)
    return this.getTelemetry({ vehicleId })
  }
}

export const telemetryService = new TelemetryService()
