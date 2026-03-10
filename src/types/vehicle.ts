export type VehicleStatus = 'moving' | 'idling' | 'offline' | 'maintenance'
export type VehicleType = 'Bus' | 'Car' | 'Van' | 'Truck'

export interface Vehicle {
  id: string
  registrationNumber: string
  vehicleName: string
  vehicleType: VehicleType
  status: VehicleStatus
  deviceId: string
  speed: number
  address: string
  lat: number
  lon: number
  lastSeen: string
}

export interface TelemetryPoint {
  timestamp: string
  lat: number
  lon: number
  speed: number
  ignition: boolean
}

export interface Trip {
  id: string
  vehicleId: string
  startTime: string
  endTime: string
  distance: number
  maxSpeed: number
}

export interface VehicleStatusCounts {
  total: number
  moving: number
  idling: number
  offline: number
  maintenance: number
}
