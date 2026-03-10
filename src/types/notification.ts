export interface Notification {
  id: string
  type: 'overspeed' | 'geofence_enter' | 'geofence_exit' | 'idling' | 'stop'
  vehicleId: string
  vehicleName: string
  message: string
  location: string
  timestamp: string
  read: boolean
}

export interface NotificationFilter {
  type?: string
}
