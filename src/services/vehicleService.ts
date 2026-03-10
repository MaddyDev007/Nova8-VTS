import type {
  TelemetryPoint,
  Trip,
  Vehicle,
  VehicleStatus,
  VehicleStatusCounts,
  VehicleType,
} from '../types/vehicle'
import { deviceService } from './deviceService'

export type CreateVehicleInput = {
  vehicleName: string
  vehicleType: VehicleType
  deviceId?: string
  createdAt: string
  updatedAt: string
}

export type CreateVehicleResponse = {
  success: true
  message: string
  vehicle: Vehicle
}

export type UpdateVehicleInput = {
  vehicleName: string
  vehicleType: VehicleType
  deviceId?: string
  updatedAt: string
}

export type UpdateVehicleResponse = {
  success: true
  message: string
  vehicle: Vehicle
}

export type DeleteVehicleResponse = {
  success: true
  message: string
}

const VEHICLE_COUNT = 10
let mockVehicles = generateMockVehicles()

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}

function randomSpeed(): number {
  return randomInt(0, 95)
}

function statusFromSpeed(speed: number): VehicleStatus {
  if (speed > 5) {
    return 'moving'
  }

  if (speed >= 1) {
    return 'idling'
  }

  return 'offline'
}

function randomTimestamp(withinHours: number): string {
  const now = Date.now()
  const offsetMs = randomBetween(0, withinHours * 60 * 60 * 1000)
  return new Date(now - offsetMs).toISOString()
}

function generateMockVehicles(): Vehicle[] {
  const baseLat = 28.6139
  const baseLon = 77.209
  const vehicleTypes: VehicleType[] = ['Bus', 'Car', 'Van', 'Truck']

  return Array.from({ length: VEHICLE_COUNT }, (_, index) => {
    const speed = randomSpeed()

    return {
      id: `veh-${index + 1}`,
      registrationNumber: `VTS-${(index + 1).toString().padStart(4, '0')}`,
      vehicleName: `VTS Vehicle ${index + 1}`,
      vehicleType: vehicleTypes[index % vehicleTypes.length],
      status: statusFromSpeed(speed),
      deviceId: index < 2 ? `VTU_${String(index + 1).padStart(3, '0')}` : 'unassigned',
      speed,
      lat: Number((baseLat + randomBetween(-0.25, 0.25)).toFixed(6)),
      lon: Number((baseLon + randomBetween(-0.25, 0.25)).toFixed(6)),
      address: `Sector ${index + 11}, New Delhi`,
      lastSeen: randomTimestamp(6),
    }
  })
}

function generateTrips(vehicleId: string): Trip[] {
  const tripCount = randomInt(3, 8)

  return Array.from({ length: tripCount }, (_, index) => {
    const durationHours = randomBetween(0.4, 3.5)
    const endTimeMs = Date.now() - index * 6 * 60 * 60 * 1000
    const startTimeMs = endTimeMs - durationHours * 60 * 60 * 1000

    return {
      id: `${vehicleId}-trip-${index + 1}`,
      vehicleId,
      startTime: new Date(startTimeMs).toISOString(),
      endTime: new Date(endTimeMs).toISOString(),
      distance: Number(randomBetween(8, 180).toFixed(1)),
      maxSpeed: randomInt(20, 105),
    }
  })
}

function generateTelemetry(vehicleId: string): TelemetryPoint[] {
  const pointCount = 20
  const seed = vehicleId.length
  const baseLat = 28.6139 + seed * 0.001
  const baseLon = 77.209 + seed * 0.001

  return Array.from({ length: pointCount }, (_, index) => {
    const speed = randomSpeed()

    return {
      timestamp: new Date(Date.now() - index * 5 * 60 * 1000).toISOString(),
      lat: Number((baseLat + randomBetween(-0.03, 0.03)).toFixed(6)),
      lon: Number((baseLon + randomBetween(-0.03, 0.03)).toFixed(6)),
      speed,
      ignition: speed > 0,
    }
  }).reverse()
}

function calculateStatusCounts(vehicles: Vehicle[]): VehicleStatusCounts {
  return vehicles.reduce<VehicleStatusCounts>(
    (counts, vehicle) => {
      counts.total += 1
      counts[vehicle.status] += 1
      return counts
    },
    { total: 0, moving: 0, idling: 0, offline: 0, maintenance: 0 },
  )
}

class VehicleService {
  async getVehicles(): Promise<Vehicle[]> {
    // TODO: Replace with REST call (e.g. GET /vehicles)
    return mockVehicles
  }

  async getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    // TODO: Replace with REST call (e.g. GET /vehicles/:vehicleId)
    return mockVehicles.find((vehicle) => vehicle.id === vehicleId) ?? null
  }

  async getVehicleTrips(vehicleId: string): Promise<Trip[]> {
    // TODO: Replace with REST call (e.g. GET /vehicles/:vehicleId/trips)
    return generateTrips(vehicleId)
  }

  async getVehicleTelemetry(vehicleId: string): Promise<TelemetryPoint[]> {
    // TODO: Replace with REST call (e.g. GET /vehicles/:vehicleId/telemetry)
    return generateTelemetry(vehicleId)
  }

  async getVehicleStatusCounts(): Promise<VehicleStatusCounts> {
    // TODO: Replace with REST call (e.g. GET /vehicles/status-counts)
    return calculateStatusCounts(mockVehicles)
  }

  async createVehicle(vehicleData: CreateVehicleInput): Promise<CreateVehicleResponse> {
    // TODO: Replace with REST call (e.g. POST /vehicles)
    const suffix = String(mockVehicles.length + 1).padStart(4, '0')
    const baseLat = 28.6139
    const baseLon = 77.209

    const nextVehicleId = `veh-${Date.now()}`
    const nextDeviceId = vehicleData.deviceId?.trim() || 'unassigned'

    const nextVehicle: Vehicle = {
      id: nextVehicleId,
      registrationNumber: `VTS-${suffix}`,
      vehicleName: vehicleData.vehicleName,
      vehicleType: vehicleData.vehicleType,
      status: 'offline',
      deviceId: nextDeviceId,
      speed: 0,
      lat: Number((baseLat + randomBetween(-0.2, 0.2)).toFixed(6)),
      lon: Number((baseLon + randomBetween(-0.2, 0.2)).toFixed(6)),
      address: `${vehicleData.vehicleType} Hub, New Delhi`,
      lastSeen: vehicleData.updatedAt,
    }

    mockVehicles = [nextVehicle, ...mockVehicles]

    try {
      if (nextDeviceId !== 'unassigned') {
        await deviceService.assignDeviceToVehicle(nextDeviceId, nextVehicleId, nextVehicle.vehicleName)
      }
    } catch (error) {
      mockVehicles = mockVehicles.filter((vehicle) => vehicle.id !== nextVehicleId)
      throw error
    }

    return {
      success: true,
      message: 'Vehicle created successfully',
      vehicle: nextVehicle,
    }
  }

  async updateVehicle(vehicleId: string, vehicleData: UpdateVehicleInput): Promise<UpdateVehicleResponse> {
    // TODO: Replace with REST call (e.g. PUT /vehicles/:vehicleId)
    const vehicleIndex = mockVehicles.findIndex((vehicle) => vehicle.id === vehicleId)

    if (vehicleIndex < 0) {
      throw new Error('Vehicle not found')
    }

    const nextDeviceId = vehicleData.deviceId?.trim() || 'unassigned'

    const currentVehicle = mockVehicles[vehicleIndex]
    const nextVehicle: Vehicle = {
      ...currentVehicle,
      vehicleName: vehicleData.vehicleName,
      vehicleType: vehicleData.vehicleType,
      deviceId: nextDeviceId,
      address: `${vehicleData.vehicleType} Hub, New Delhi`,
      lastSeen: vehicleData.updatedAt,
    }

    mockVehicles = [
      ...mockVehicles.slice(0, vehicleIndex),
      nextVehicle,
      ...mockVehicles.slice(vehicleIndex + 1),
    ]

    const previousDeviceId = currentVehicle.deviceId !== 'unassigned' ? currentVehicle.deviceId : null
    const normalizedNextDeviceId = nextVehicle.deviceId !== 'unassigned' ? nextVehicle.deviceId : null

    if (previousDeviceId && previousDeviceId !== normalizedNextDeviceId) {
      await deviceService.unassignDeviceFromVehicle(previousDeviceId)
    }

    if (normalizedNextDeviceId) {
      await deviceService.assignDeviceToVehicle(
        normalizedNextDeviceId,
        nextVehicle.id,
        nextVehicle.vehicleName,
      )
    }

    return {
      success: true,
      message: 'Vehicle updated successfully',
      vehicle: nextVehicle,
    }
  }

  async deleteVehicle(vehicleId: string): Promise<DeleteVehicleResponse> {
    // TODO: Replace with REST call (e.g. DELETE /vehicles/:vehicleId)
    const existing = mockVehicles.find((vehicle) => vehicle.id === vehicleId)
    if (existing?.deviceId && existing.deviceId !== 'unassigned') {
      await deviceService.unassignDeviceFromVehicle(existing.deviceId)
    }

    mockVehicles = mockVehicles.filter((vehicle) => vehicle.id !== vehicleId)

    return {
      success: true,
      message: 'Vehicle deleted successfully',
    }
  }
}

export const vehicleService = new VehicleService()
