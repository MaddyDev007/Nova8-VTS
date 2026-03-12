import type { TelemetryPoint, Trip, Vehicle, VehicleStatusCounts, VehicleType } from '../types/vehicle'
import { apiClient } from '../api/apiClient'

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

type BackendVehicle = {
  id: string
  registrationNumber: string
  vehicleName: string
  vehicleType: VehicleType
  status: Vehicle['status']
  deviceId: string | null
  speed: number
  lat: number | null
  lon: number | null
  address: string | null
  lastSeen: string | null
}

function normalizeVehicle(vehicle: BackendVehicle): Vehicle {
  return {
    id: vehicle.id,
    registrationNumber: vehicle.registrationNumber,
    vehicleName: vehicle.vehicleName,
    vehicleType: vehicle.vehicleType,
    status: vehicle.status,
    deviceId: vehicle.deviceId ?? 'unassigned',
    speed: vehicle.speed ?? 0,
    lat: vehicle.lat ?? 0,
    lon: vehicle.lon ?? 0,
    address: vehicle.address ?? 'Unknown location',
    lastSeen: vehicle.lastSeen ?? '',
  }
}

class VehicleService {
  async getVehicles(): Promise<Vehicle[]> {
    const vehicles = await apiClient.get<BackendVehicle[]>('/vehicles')
    return vehicles.map(normalizeVehicle)
  }

  async getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    const vehicle = await apiClient.get<BackendVehicle>(`/vehicles/${vehicleId}`)
    return normalizeVehicle(vehicle)
  }

  async getVehicleTrips(vehicleId: string): Promise<Trip[]> {
    return apiClient.get<Trip[]>(`/vehicles/${vehicleId}/trips`)
  }

  async getVehicleTelemetry(vehicleId: string): Promise<TelemetryPoint[]> {
    return apiClient.get<TelemetryPoint[]>(`/vehicles/${vehicleId}/telemetry`)
  }

  async getVehicleStatusCounts(): Promise<VehicleStatusCounts> {
    return apiClient.get<VehicleStatusCounts>('/vehicles/status-counts')
  }

  async createVehicle(vehicleData: CreateVehicleInput): Promise<CreateVehicleResponse> {
    const response = await apiClient.post<CreateVehicleResponse>('/vehicles', {
      vehicleName: vehicleData.vehicleName,
      vehicleType: vehicleData.vehicleType,
      deviceId: vehicleData.deviceId,
    })

    return {
      ...response,
      vehicle: normalizeVehicle(response.vehicle as unknown as BackendVehicle),
    }
  }

  async updateVehicle(vehicleId: string, vehicleData: UpdateVehicleInput): Promise<UpdateVehicleResponse> {
    const response = await apiClient.put<UpdateVehicleResponse>(`/vehicles/${vehicleId}`, {
      vehicleName: vehicleData.vehicleName,
      vehicleType: vehicleData.vehicleType,
      deviceId: vehicleData.deviceId,
    })

    return {
      ...response,
      vehicle: normalizeVehicle(response.vehicle as unknown as BackendVehicle),
    }
  }

  async deleteVehicle(vehicleId: string): Promise<DeleteVehicleResponse> {
    return apiClient.delete<DeleteVehicleResponse>(`/vehicles/${vehicleId}`)
  }
}

export const vehicleService = new VehicleService()
