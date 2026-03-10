export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  collegeId?: string
  timezone: string
}

export interface NotificationPreferences {
  overspeed: boolean
  idling: boolean
  geofence: boolean
  stop: boolean
  deviceOffline: boolean
}
