export interface OverspeedEvent {
  id: string
  vehicleId: string
  vehicleName: string
  tripId: string
  maxSpeed: number
  speedLimit: number
  duration: number
  startTime: string
  endTime: string
  location: string
  lat: number
  lon: number
}

export interface IdlingEvent {
  id: string
  vehicleId: string
  vehicleName: string
  tripId: string
  duration: number
  startTime: string
  endTime: string
  location: string
  lat: number
  lon: number
}

export interface StopEvent {
  id: string
  vehicleId: string
  vehicleName: string
  tripId: string
  duration: number
  startTime: string
  endTime: string
  location: string
  lat: number
  lon: number
}
