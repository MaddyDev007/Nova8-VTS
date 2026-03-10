import type { Notification } from '../types/notification'

type CreateNotificationInput = {
  type: Notification['type']
  vehicleId: string
  vehicleName: string
  message: string
  location: string
  timestamp?: string
}

const MOCK_VEHICLES = [
  { id: 'veh-1', name: 'VTS Vehicle 1' },
  { id: 'veh-2', name: 'VTS Vehicle 2' },
  { id: 'veh-3', name: 'VTS Vehicle 3' },
  { id: 'veh-4', name: 'VTS Vehicle 4' },
  { id: 'veh-5', name: 'VTS Vehicle 5' },
]

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function createMockNotification(type: Notification['type'], index: number): Notification {
  const vehicle = MOCK_VEHICLES[index % MOCK_VEHICLES.length]
  const timestamp = new Date(Date.now() - index * randomInt(3, 18) * 60 * 1000).toISOString()
  const sector = randomInt(10, 95)

  const messageByType: Record<Notification['type'], string> = {
    overspeed: `${vehicle.name} overspeed alert`,
    geofence_enter: `${vehicle.name} entered geofence`,
    geofence_exit: `${vehicle.name} exited geofence`,
    idling: `${vehicle.name} idling detected`,
    stop: `${vehicle.name} stop detected`,
  }

  return {
    id: `ntf-${String(index + 1).padStart(4, '0')}`,
    type,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    message: messageByType[type],
    location: `Sector ${sector}, New Delhi`,
    timestamp,
    read: index % 4 === 0,
  }
}

function buildInitialMockNotifications(): Notification[] {
  const types: Notification['type'][] = ['overspeed', 'geofence_enter', 'geofence_exit', 'idling', 'stop']
  return Array.from({ length: 25 }, (_, index) => createMockNotification(types[index % types.length], index)).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
}

let mockNotifications: Notification[] = buildInitialMockNotifications()

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    // TODO: Replace with REST call (GET /notifications)
    return [...mockNotifications]
  }

  async markAsRead(notificationId: string): Promise<Notification | null> {
    // TODO: Replace with REST call (PATCH /notifications/:id/read)
    const index = mockNotifications.findIndex((notification) => notification.id === notificationId)
    if (index === -1) {
      return null
    }

    mockNotifications[index] = { ...mockNotifications[index], read: true }
    return mockNotifications[index]
  }

  async markAllAsRead(): Promise<Notification[]> {
    // TODO: Replace with REST call (PATCH /notifications/:id/read in batch endpoint)
    mockNotifications = mockNotifications.map((notification) => ({ ...notification, read: true }))
    return [...mockNotifications]
  }

  async createNotification(payload: CreateNotificationInput): Promise<Notification> {
    // TODO: Replace with REST call (POST /notifications)
    const notification: Notification = {
      id: `ntf-${Math.random().toString(36).slice(2, 10)}`,
      type: payload.type,
      vehicleId: payload.vehicleId,
      vehicleName: payload.vehicleName,
      message: payload.message,
      location: payload.location,
      timestamp: payload.timestamp ?? new Date().toISOString(),
      read: false,
    }

    mockNotifications = [notification, ...mockNotifications]
    return notification
  }
}

export const notificationService = new NotificationService()
